import { useState } from "react";
import { useLocation, Link } from "react-router-dom";

const MpesaPayment = () => {
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Get product from location state
    const location = useLocation();
    const product = location.state?.product;
    console.log(product)

    const img_url = "https://ttok.pythonanywhere.com/static/images/";

    // Validate phone number format
    const isValidPhoneNumber = (phone) => {
        const regex = /^254[17]\d{8}$/; // Matches 2547xxxxxxxx or 2541xxxxxxxx
        return regex.test(phone);
    };

    const submitForm = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!isValidPhoneNumber(phone)) {
            setError("Please enter a valid phone number in the format 2547xxxxxxxx or 2541xxxxxxxx.");
            return;
        }

        setLoading(true);

        try {
            // Create FormData object
            const formData = new FormData();
            formData.append("phone", phone);
            formData.append("amount", product.price);

            const response = await fetch("https://ttok.pythonanywhere.com/api/mpesa_payment", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Payment failed");
            }

            setSuccess(data.message || "Payment initiated successfully");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // If product is missing, show error
    if (!product) {
        return (
            <div className="text-center mt-5">
                <h2>No product data available.</h2>
                <Link to="/" className="btn btn-primary mt-3">Go Back Home</Link>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-5 mb-4">
                    <div className="card shadow">
                        <img 
                            src={img_url + product.image_url} 
                            className="card-img-top" 
                            alt={product.name}
                        />
                    </div>
                </div>

                <div className="col-md-5">
                    <div className="card shadow p-3">
                        <h2 className="mb-3">{product.name}</h2>
                        <h4 className="text-warning mb-3">{product.price}</h4>
                        <p className="text-muted mb-4">{product.product_desc}</p>

                        {loading && (
                            <div className="alert alert-info mb-3">
                                Processing payment, please wait...
                            </div>
                        )}
                        {error && (
                            <div className="alert alert-danger mb-3">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="alert alert-success mb-3">
                                {success}
                            </div>
                        )}

                        <form onSubmit={submitForm}>
                            <div className="mb-3">
                                <label className="form-label">Amount</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={product.price} 
                                    readOnly 
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Phone Number</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    placeholder="Enter M-Pesa number (2547xxxxxxxx)"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                                <small className="text-muted">
                                    Format: 2547xxxxxxxx or 2541xxxxxxxx
                                </small>
                            </div>

                            <button 
                                className="btn btn-primary w-100 py-2"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span 
                                            className="spinner-border spinner-border-sm me-2" 
                                            role="status" 
                                            aria-hidden="true"
                                        ></span>
                                        Processing...
                                    </>
                                ) : "Pay Now"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MpesaPayment;