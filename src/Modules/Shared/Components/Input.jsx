    import './Input.css';  

    function Input({label, type, value, onChange, error}){
        return (
            <div className="input-container">
                <div className="input-field">
                    <label>{label}</label>
                    <input
                        type={type}
                        value={value}
                        onChange={onChange}
                    />
                </div>
                {error && <span className="error-message">
                    {error}
                </span>}
            </div>
        );
    }

    export default Input;