import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Card from "../../Shared/Components/Card";
import Input from "../../Shared/Components/Input";
import Button from "../../Shared/Components/Button";
import { createProduct } from "../Services/ProductsService";
import { useState } from "react";

function CreateProduct() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const onSubmit = async (data) => {
        setIsSubmitting(true); // Bloqueamos el botón
        setSubmitError(null); // Limpiamos errores previos

        const productData = {
            sku: data.sku,
            internalCode: data.internalCode, 
            name: data.name,
            description: data.description,
            currentUnitPrice: parseFloat(data.price), // Mapeo: price -> currentUnitPrice
            stockQuantity: parseInt(data.stock),      // Mapeo: stock -> stockQuantity
        };

        const result = await createProduct(productData);

        setIsSubmitting(false); // Desbloqueamos

        if (result.success) {
            alert("¡Producto creado exitosamente!");
            navigate('/admin/products'); 
        } else {
            alert("Error: " + result.error);
            setSubmitError(result.error || "Ocurrió un error inesperado.");
        }
    };

    return (
        <Card className="bg-gray-700">
            <div className="h full overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">Crear Producto</h2>
                
                {submitError && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r shadow-sm flex items-start gap-3">
                        <div>
                            <p className="font-bold">No se pudo crear el producto</p>
                            <p className="text-sm">{submitError}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                    
                    <Input
                        label="SKU"
                        type="text"
                        placeholder="Ingrese el SKU"
                        error={errors.sku?.message}
                        {...register("sku", { required: "El SKU es obligatorio" })}
                    />
                    <Input
                        label="Codigo Unico"
                        type="text"
                        placeholder="Ingrese el codigo"
                        error={errors.internalCode?.message}
                        {...register("internalCode", { required: "El codigo unico es obligatorio" })}
                    />
                    <Input
                        label="Nombre"
                        type="text"
                        placeholder="Nombre del producto"
                        error={errors.name?.message}
                        {...register("name", { required: "El nombre es obligatorio" })}
                    />
                    <Input
                        label="Descripción"
                        type="text"
                        placeholder="Descripción del producto"
                        error={errors.description?.message}
                        {...register("description", { required: "La descripción es obligatoria" })}
                    />

                    <Input
                            label="Precio"
                            type="number"
                            placeholder="0.00"
                            // Paso "any" para permitir decimales
                            step="any" 
                            error={errors.price?.message}
                            {...register("price", { 
                                required: "El precio es obligatorio",
                                min: { value: 0, message: "El precio no puede ser negativo" }
                            })}
                    />
                    <Input
                            label="Stock Inicial"
                            type="number"
                            placeholder="0"
                            error={errors.stock?.message}
                            {...register("stock", { 
                                required: "El stock es obligatorio",
                                min: { value: 0, message: "El stock no puede ser negativo" }
                            })}
                        />

                    

                    {/* Botón de Crear */}
                    <div className="mt-4">
                        <Button type="submit" className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors">
                            Crear Producto
                        </Button>
                    </div>

                </form>
            </div>
        </Card>
    );
}

export default CreateProduct;