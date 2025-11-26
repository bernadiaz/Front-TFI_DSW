import Card from "../../Shared/Components/Card.jsx";

function HomePage() {
    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Home Page</h1>
            <div className="flex flex-col gap-3">
                <Card>
                    <h1>Productos</h1>
                    <div>Cantidad: #</div>
                </Card>
                <Card>
                    <h1>Ordenes</h1>
                    <div>Cantidad: #</div>
                </Card>
            </div>
        </>
    );
}

export default HomePage;