import Button from "../../Shared/Components/Button";
import { X } from "lucide-react";


const SelectionModal= ({ onClose, onLoginClick, onRegisterClick }) =>{
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
                <button 
                    onClick={onClose} 
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={24} />
                </button>
                
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Para continuar</h2>
                    <p className="text-gray-500">Necesitas iniciar sesión o crear una cuenta para finalizar tu compra.</p>
                </div>

                <div className="flex flex-col gap-3">
                    <Button onClick={onLoginClick} fullWidth>
                        Iniciar Sesión
                    </Button>
                    <Button variant="secondary" onClick={onRegisterClick} fullWidth>
                        Registrarse
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default SelectionModal;