import React from 'react';
import { X, Calendar, User, Droplet } from 'lucide-react';
import { type FuelEntry } from '../../services/googleSheets';
import './EntriesModal.css';

interface EntriesModalProps {
    isOpen: boolean;
    onClose: () => void;
    entries: FuelEntry[];
    isLoading: boolean;
}

export const EntriesModal: React.FC<EntriesModalProps> = ({ isOpen, onClose, entries, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Last 10 Entries</h3>
                    <button onClick={onClose} className="close-btn">
                        <X size={24} />
                    </button>
                </div>

                <div className="modal-body">
                    {isLoading ? (
                        <div className="loading-state">Loading entries...</div>
                    ) : entries.length === 0 ? (
                        <div className="empty-state">No entries found</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="entries-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Vehicle</th>
                                        <th>Driver</th>
                                        <th>Fuel Supervisor</th>
                                        <th>Fuel</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {entries.map((entry, index) => (
                                        <tr key={index}>
                                            <td data-label="Date">
                                                <div className="td-content">
                                                    <Calendar size={14} />
                                                    {entry.dateOfBill}
                                                </div>
                                            </td>
                                            <td data-label="Vehicle">
                                                <div className="vehicle-info">
                                                    <span className="vehicle-number">{entry.vehicleNumber}</span>
                                                    <span className="vehicle-type">{entry.vehicleType}</span>
                                                </div>
                                            </td>
                                            <td data-label="Driver">
                                                <div className="td-content">
                                                    <User size={14} />
                                                    {entry.driverName}
                                                </div>
                                            </td>
                                            <td data-label="Fuel Supervisor">
                                                <div className="td-content">
                                                    <User size={14} />
                                                    {entry.supervisorName}
                                                </div>
                                            </td>
                                            <td data-label="Fuel">
                                                <div className="td-content">
                                                    <Droplet size={14} />
                                                    {entry.quantity} {entry.fuelType}
                                                </div>
                                            </td>
                                            <td className="amount-cell" data-label="Amount">
                                                ₹{entry.totalAmount}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
