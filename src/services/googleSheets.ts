// Google Apps Script Web App Configuration
// TODO: Replace with your actual Web App URL after deploying the script
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyeaZZMHzq2p-yuwpFqnLzS59Cgtyp5ngU_ulh_rXPRZQYfZYGTnEaNpAV83CzUH3HpuA/exec';

export interface FuelEntry {
    dateOfBill: string;
    receiptNumber: string;
    driverName: string;
    vehicleNumber: string;
    vehicleType: string;
    fuelType: string;
    quantity: string;
    fuelRate: string;
    totalAmount: string;
    supervisorName: string;
}

/**
 * Submits data to the Google Apps Script Web App
 * @param data Fuel Entry Data
 */
export const submitToWebApp = async (data: FuelEntry) => {
    try {
        // Use 'no-cors' mode to bypass CORS restrictions.
        // LIMITATION: We cannot read the response (it will be opaque).
        // We assume success if the request is sent without a network error.
        await fetch(WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        // Return a mock success response because we can't read the real one in no-cors mode
        return { result: 'success' };
    } catch (error) {
        console.error('Error submitting to Web App:', error);
        throw error;
    }
};

export const fetchLastEntries = async (): Promise<FuelEntry[]> => {
    try {
        // Note: This requires the Google Apps Script to handle GET requests and return JSON with CORS headers
        const response = await fetch(`${WEB_APP_URL}?action=getLast10`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.entries || [];
    } catch (error) {
        console.error("Failed to fetch entries", error);
        throw error;
    }
};

// Legacy function removed as we are no longer using direct API access
export const appendToSheet = async () => {
    throw new Error("Direct API access is deprecated. Use submitToWebApp instead.");
};
