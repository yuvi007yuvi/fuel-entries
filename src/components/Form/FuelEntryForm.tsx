import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, AlertCircle, Calendar, FileText, User, Truck, Droplet, Hash, IndianRupee, Phone } from 'lucide-react';
import { submitToWebApp } from '../../services/googleSheets';
import logo from '../../assets/logo.png';
import './FuelEntryForm.css';

// No props needed now
interface FuelEntryFormProps { }

interface FormData {
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
    supervisorContact: string;
}

const INITIAL_DATA: FormData = {
    dateOfBill: new Date().toISOString().split('T')[0],
    receiptNumber: '',
    driverName: '',
    vehicleNumber: '',
    vehicleType: '',
    fuelType: '',
    quantity: '',
    fuelRate: '',
    totalAmount: '',
    supervisorName: '',
    supervisorContact: ''
};

export const FuelEntryForm: React.FC<FuelEntryFormProps> = () => {
    const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // Auto-calculate Total Amount
    useEffect(() => {
        const qty = parseFloat(formData.quantity);
        const rate = parseFloat(formData.fuelRate);
        if (!isNaN(qty) && !isNaN(rate)) {
            setFormData(prev => ({ ...prev, totalAmount: (qty * rate).toFixed(2) }));
        } else {
            setFormData(prev => ({ ...prev, totalAmount: '' }));
        }
    }, [formData.quantity, formData.fuelRate]);

    const validate = (): boolean => {
        const newErrors: Partial<FormData> = {};

        if (!formData.dateOfBill) newErrors.dateOfBill = 'Date is required';
        if (!formData.receiptNumber) newErrors.receiptNumber = 'Receipt number is required';
        if (!formData.driverName) newErrors.driverName = 'Driver name is required';

        // Vehicle Number Validation (Basic India format or generic)
        const vehicleRegex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/i; // Example: MP04AB1234

        if (!formData.vehicleNumber) {
            newErrors.vehicleNumber = 'Vehicle number is required';
        } else if (!vehicleRegex.test(formData.vehicleNumber)) {
            newErrors.vehicleNumber = 'Invalid format (e.g. MP04AB1234)';
        }

        if (!formData.vehicleType) newErrors.vehicleType = 'Vehicle type is required';
        if (!formData.fuelType) newErrors.fuelType = 'Fuel type is required';

        if (!formData.quantity || parseFloat(formData.quantity) <= 0) newErrors.quantity = 'Valid quantity required';
        if (!formData.fuelRate || parseFloat(formData.fuelRate) <= 0) newErrors.fuelRate = 'Valid rate required';

        if (!formData.supervisorName) newErrors.supervisorName = 'Supervisor name is required';

        // Mobile Validation
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!formData.supervisorContact) newErrors.supervisorContact = 'Contact number is required';
        else if (!phoneRegex.test(formData.supervisorContact)) newErrors.supervisorContact = 'Invalid mobile number';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name as keyof FormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            await submitToWebApp(formData);

            setSubmitStatus('success');
            setFormData(INITIAL_DATA);
            setTimeout(() => setSubmitStatus('idle'), 3000);
        } catch (error) {
            console.error('Submission error:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="form-container">
            <div className="form-card">
                <div className="form-header">
                    <img src={logo} alt="Logo" className="form-logo" />
                    <div>
                        <h2 className="form-title">New Fuel Entry</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Secure Field Data Capture</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="form-grid">
                    {/* Date & Receipt */}
                    <div className="form-group">
                        <label>Date of Bill</label>
                        <div className="input-wrapper">
                            <Calendar className="input-icon" size={18} />
                            <input
                                type="date"
                                name="dateOfBill"
                                value={formData.dateOfBill}
                                onChange={handleChange}
                            />
                        </div>
                        {errors.dateOfBill && <span className="error-msg">{errors.dateOfBill}</span>}
                    </div>

                    <div className="form-group">
                        <label>Receipt Number</label>
                        <div className="input-wrapper">
                            <FileText className="input-icon" size={18} />
                            <input
                                type="text"
                                name="receiptNumber"
                                placeholder="e.g., RCP-2024-001"
                                value={formData.receiptNumber}
                                onChange={handleChange}
                            />
                        </div>
                        {errors.receiptNumber && <span className="error-msg">{errors.receiptNumber}</span>}
                    </div>

                    {/* Vehicle Details */}
                    <div className="form-group">
                        <label>Vehicle Number</label>
                        <div className="input-wrapper">
                            <Truck className="input-icon" size={18} />
                            <input
                                type="text"
                                name="vehicleNumber"
                                placeholder="e.g., MP04AB1234"
                                value={formData.vehicleNumber}
                                onChange={handleChange}
                                style={{ textTransform: 'uppercase' }}
                            />
                        </div>
                        {errors.vehicleNumber && <span className="error-msg">{errors.vehicleNumber}</span>}
                    </div>

                    <div className="form-group">
                        <label>Vehicle Type</label>
                        <div className="input-wrapper">
                            <Truck className="input-icon" size={18} />
                            <select name="vehicleType" value={formData.vehicleType} onChange={handleChange}>
                                <option value="">Select Type</option>
                                <option value="Truck">Truck</option>
                                <option value="Bus">Bus</option>
                                <option value="Car">Car</option>
                                <option value="JCB">JCB</option>
                                <option value="E-Rickshaw">E-Rickshaw</option>
                                <option value="Generator">Generator</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        {errors.vehicleType && <span className="error-msg">{errors.vehicleType}</span>}
                    </div>

                    <div className="form-group">
                        <label>Driver Name</label>
                        <div className="input-wrapper">
                            <User className="input-icon" size={18} />
                            <input
                                type="text"
                                name="driverName"
                                placeholder="Enter driver name"
                                value={formData.driverName}
                                onChange={handleChange}
                            />
                        </div>
                        {errors.driverName && <span className="error-msg">{errors.driverName}</span>}
                    </div>

                    {/* Fuel Details */}
                    <div className="form-group">
                        <label>Fuel Type</label>
                        <div className="input-wrapper">
                            <Droplet className="input-icon" size={18} />
                            <select name="fuelType" value={formData.fuelType} onChange={handleChange}>
                                <option value="">Select Fuel</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Petrol">Petrol</option>
                                <option value="CNG">CNG</option>
                                <option value="EV Charging">EV Charging</option>
                            </select>
                        </div>
                        {errors.fuelType && <span className="error-msg">{errors.fuelType}</span>}
                    </div>

                    <div className="form-group">
                        <label>Quantity (L/Kg/Unit)</label>
                        <div className="input-wrapper">
                            <Hash className="input-icon" size={18} />
                            <input
                                type="number"
                                step="0.01"
                                name="quantity"
                                placeholder="0.00"
                                value={formData.quantity}
                                onChange={handleChange}
                            />
                        </div>
                        {errors.quantity && <span className="error-msg">{errors.quantity}</span>}
                    </div>

                    <div className="form-group">
                        <label>Fuel Rate (₹)</label>
                        <div className="input-wrapper">
                            <IndianRupee className="input-icon" size={18} />
                            <input
                                type="number"
                                step="0.01"
                                name="fuelRate"
                                placeholder="0.00"
                                value={formData.fuelRate}
                                onChange={handleChange}
                            />
                        </div>
                        {errors.fuelRate && <span className="error-msg">{errors.fuelRate}</span>}
                    </div>

                    <div className="form-group">
                        <label>Total Amount (₹)</label>
                        <div className="input-wrapper">
                            <IndianRupee className="input-icon" size={18} />
                            <input
                                type="text"
                                name="totalAmount"
                                value={formData.totalAmount}
                                readOnly
                                style={{ fontWeight: 'bold', color: 'var(--success)' }}
                            />
                        </div>
                    </div>

                    {/* Supervisor Details */}
                    <div className="form-group">
                        <label>Supervisor Name</label>
                        <div className="input-wrapper">
                            <User className="input-icon" size={18} />
                            <select
                                name="supervisorName"
                                value={formData.supervisorName}
                                onChange={handleChange}
                            >
                                <option value="">Select Supervisor</option>
                                <option value="Ashish-mathura">Ashish-Mathura</option>
                                <option value="Amardeep-mathura">Amardeep-Mathura</option>
                                <option value="sumit-vrindavan">Sumit-Vrindavan</option>
                            </select>
                        </div>
                        {errors.supervisorName && <span className="error-msg">{errors.supervisorName}</span>}
                    </div>

                    <div className="form-group">
                        <label>Supervisor Contact</label>
                        <div className="input-wrapper">
                            <Phone className="input-icon" size={18} />
                            <input
                                type="tel"
                                name="supervisorContact"
                                placeholder="10-digit Mobile Number"
                                value={formData.supervisorContact}
                                onChange={handleChange}
                                maxLength={10}
                            />
                        </div>
                        {errors.supervisorContact && <span className="error-msg">{errors.supervisorContact}</span>}
                    </div>

                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? (
                            'Submitting...'
                        ) : (
                            <>
                                <Save size={20} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
                                Submit Entry
                            </>
                        )}
                    </button>
                </form>

                {submitStatus === 'success' && (
                    <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle2 size={20} />
                        Entry submitted successfully!
                    </div>
                )}

                {submitStatus === 'error' && (
                    <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <AlertCircle size={20} />
                        Failed to submit entry. Please try again.
                    </div>
                )}
            </div>
        </div>
    );
};
