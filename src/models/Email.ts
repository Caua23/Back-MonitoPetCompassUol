export class Email {
    private email: string;

    constructor(email: string) {
        if (!this.isValidEmail(email)) {
            throw new Error("Invalid email address");
        }
        this.email = email;
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    public getEmail(): string {
        return this.email;
    }
}
