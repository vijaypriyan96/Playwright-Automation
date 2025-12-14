import * as date from "date-and-time";

export const resolveFunction = (input: string): string => {
    let days = 0;

    switch (input) {
        case "<<today-date>>":
            return date.format(new Date(), "YYYY-DD-MM");

        case "<<today-date-time>>":
            return date.format(new Date(), "YYYY-DD-MM hh:mm:ss A");

        case "<<today-X Days>>":
            days = parseInt(input[6]);
            if (typeof days === "number") {
                return date.format(date.addDays(new Date(), -days), "YYYY-DD-MM");
            } else {
                throw new Error("Days parameter is required for <<today-XDays>>");
            }

        case "<<today+X Days>>":
            days = parseInt(input[6]);
            if (typeof days === "number") {
                return date.format(date.addDays(new Date(), days), "YYYY-DD-MM");
            } else {
                throw new Error("Days parameter is required for <<today-XDays>>");
            }

        default:
            return input;
    }
};

export function getRandomUser(): { name: string, email: string } {
    const id = Math.floor(Math.random() * 1000);
    return {
        name: "User" + id,
        email: "user" + id + "@example.com"
    };
};