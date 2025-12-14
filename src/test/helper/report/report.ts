import path from "path";
import * as fs from "fs-extra";

type systemInfo = { 
    browser: { name: string; version: string }; 
    platform: { name: string; version: string } 
};

type TestSummary = {
    totalFeatures: number;
    totalScenarios: number;
    passedScenarios: number;
    failedScenarios: number;
    totalDuration: number;
};

const report = require("multiple-cucumber-html-reporter");
const currentRepo = path.join(__dirname, '../');
const infoFilePath = path.join(currentRepo, '/testData/systemInfo.json');
const jsonResultsPath = "test-results";

async function calculateTestSummary(cucumberResults: any[]): Promise<TestSummary> {
    let summary = {
        totalFeatures: cucumberResults.length,
        totalScenarios: 0,
        passedScenarios: 0,
        failedScenarios: 0,
        totalDuration: 0
    };

    for (const feature of cucumberResults) {
        const scenarios = feature.elements || [];
        summary.totalScenarios += scenarios.length;
        
        for (const scenario of scenarios) {
            const steps = scenario.steps || [];
            let scenarioPassed = true;
            let scenarioDuration = 0;

            for (const step of steps) {
                if (step.result) {
                    scenarioDuration += step.result.duration || 0;
                    if (step.result.status === 'failed') {
                        scenarioPassed = false;
                    }
                }
            }

            if (scenarioPassed) {
                summary.passedScenarios++;
            } else {
                summary.failedScenarios++;
            }
            summary.totalDuration += scenarioDuration;
        }
    }

    return summary;
}

async function generateReport() {
    try {
        // Read system info
        let info: systemInfo = {
            browser: { name: 'Unknown Browser', version: 'Unknown Version' },
            platform: { name: 'Unknown Platform', version: 'Unknown Version' }
        };

        if (await fs.pathExists(infoFilePath)) {
            const fileInfo = await fs.readJson(infoFilePath);
            info = {
                browser: {
                    name: fileInfo.browser?.name,
                    version: fileInfo.browser?.version,
                },
                platform: {
                    name: fileInfo.platform?.name,
                    version: fileInfo.platform?.version,
                }
            };
        }

        // Read the cucumber JSON results
        const jsonFile = path.join(jsonResultsPath, 'cucumber-json.json');
        const cucumberResults = await fs.readJson(jsonFile);
        const summary = await calculateTestSummary(cucumberResults);

        // Generate individual feature reports
        for (const feature of cucumberResults) {
            const featureTitle = feature.name.replace(/[^a-zA-Z0-9]/g, '_');
            const featureDir = path.join(jsonResultsPath, 'reports', featureTitle);
            await fs.ensureDir(featureDir);
            
            const tempJsonDir = path.join(featureDir, 'json');
            await fs.ensureDir(tempJsonDir);
            await fs.writeJson(path.join(tempJsonDir, 'feature.json'), [feature]);

            report.generate({
                jsonDir: tempJsonDir,
                reportPath: featureDir,
                reportName: featureTitle,  // This will be used in the filename
                pageTitle: feature.name,   // This will be shown in the browser tab
                displayDuration: true,
                metadata: {
                    browser: {
                        name: info.browser.name,
                        version: info.browser.version,
                    },
                    device: info.platform.name,
                    platform: {
                        name: info.platform.name,
                        version: info.platform.version,
                    }
                },
                customData: {
                    title: "Run info",
                    data: [
                        { label: "Project", value: "Playwright BDD Framework" },
                        { label: "Feature", value: feature.name },
                        { label: "Description", value: feature.description || "NA" },
                        { label: "Total Scenarios", value: feature.elements?.length || 0 },
                        { label: "Execution Start Time", value: new Date().toLocaleString() }
                    ]
                }
            });

            await fs.remove(tempJsonDir);
            
            // Rename index.html to feature title
            const oldPath = path.join(featureDir, 'index.html');
            const newPath = path.join(featureDir, `${featureTitle}.html`);
            if (await fs.pathExists(oldPath)) {
                await fs.rename(oldPath, newPath);
            }
        }

        // Update links in the full report to point to renamed files
        const reportsList = cucumberResults.map((feature: { name: any; elements: string | any[]; description: any; }) => {
            const featureTitle = feature.name.replace(/[^a-zA-Z0-9]/g, '_');
            return `
                <tr>
                    <td><a href="./${featureTitle}/${featureTitle}.html" target="_blank">${feature.name}</a></td>
                    <td>${feature.elements?.length || 0}</td>
                    <td>${feature.description || "NA"}</td>
                </tr>`;
        }).join('\n');

        const indexHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Test Execution Report</title>
                <style>
                    body { font-family: 'Roboto', sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
                    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                    h1 { color: #2d3748; margin-bottom: 20px; }
                    .summary-box { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
                    .summary-item { background: #fff; padding: 15px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
                    .summary-item h3 { margin: 0; color: #4a5568; }
                    .summary-item p { margin: 10px 0 0; font-size: 24px; font-weight: bold; }
                    .success { color: #48bb78; }
                    .error { color: #f56565; }
                    .info { color: #4299e1; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
                    th { background-color: #f7fafc; color: #4a5568; }
                    tr:hover { background-color: #f7fafc; }
                    a { color: #4299e1; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                    .metadata { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Test Execution Report</h1>
                    <div class="summary-box">
                        <div class="summary-item">
                            <h3>Total Features</h3>
                            <p class="info">${summary.totalFeatures}</p>
                        </div>
                        <div class="summary-item">
                            <h3>Total Scenarios</h3>
                            <p class="info">${summary.totalScenarios}</p>
                        </div>
                        <div class="summary-item">
                            <h3>Passed Scenarios</h3>
                            <p class="success">${summary.passedScenarios}</p>
                        </div>
                        <div class="summary-item">
                            <h3>Failed Scenarios</h3>
                            <p class="error">${summary.failedScenarios}</p>
                        </div>
                    </div>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>Feature</th>
                                <th>Scenarios</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reportsList}
                        </tbody>
                    </table>

                    <div class="metadata">
                        <h3>Environment Info</h3>
                        <p>Browser: ${info.browser.name} ${info.browser.version}</p>
                        <p>Platform: ${info.platform.name} ${info.platform.version}</p>
                        <p>Execution Time: ${new Date().toLocaleString()}</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await fs.writeFile(path.join(jsonResultsPath, 'reports', 'FullReport.html'), indexHtml);

    } catch (error) {
        console.error('Error generating reports:', error);
    }
}

generateReport().catch(console.error);