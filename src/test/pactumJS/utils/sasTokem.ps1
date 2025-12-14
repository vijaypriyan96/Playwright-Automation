function Get-StorageAccountKey {
    param (
        [string]$resourceGroupName,
        [string]$storageAccountName,
        [string]$keyName
    )

    $storageAccountKey = (Get-AzStorageAccountKey -ResourceGroupName $resourceGroupName -Name $storageAccountName |
        Where-Object { $_.KeyName -eq $keyName }).Value

    return $storageAccountKey
}

function New-SecurePSCredential {
    param (
        [string]$userName,
        [string]$password
    )

    $securePassword = $password | ConvertTo-SecureString -AsPlainText -Force
    $credential = New-Object -TypeName PSCredential -ArgumentList $userName, $securePassword

    return $credential
}

function New-SasToken {
    param (
        [string]$storageAccountName,
        [string]$storageAccountKey,
        [datetime]$startTime,
        [datetime]$endTime,
        [string]$permissions
    )

    $storageContext = New-AzStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey
    $sasToken = New-AzStorageAccountSASToken -Context $storageContext -Service Blob,Table,Queue,File -ResourceType Service,Container,Object -Permission $permissions -StartTime $startTime -ExpiryTime $endTime

    return $sasToken
}


try {
    # Set the security protocol to TLS 1.2
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

    # Stop the script execution on any errors
    $ErrorActionPreference = 'Stop'

	# Authenticate with Azure using the provided credentials
	$credential = New-SecurePSCredential -userName "  " -password "  "
	Connect-AzAccount -Credential $credential | Out-Null

	# Retrieve the storage account key
	$storageAccountKey = Get-StorageAccountKey -resourceGroupName "   " -storageAccountName "   " -keyName "  "

	# Generate the SAS token
	$startTime = (Get-Date).AddMinutes(-20)
	$endTime = $startTime.AddHours(1).AddMinutes(40)
	$sasToken = New-SasToken -storageAccountName "  " -storageAccountKey $storageAccountKey -startTime $startTime -endTime $endTime -permissions "rl"

	# Output the SAS token
	return $sasToken
}

catch {
    Write-Error "FAILURE - unhandled exception in get-sas-token:`r`n$_" 
}