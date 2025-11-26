    

function Card({children}) {
    return(
        <div className="bg-white border border-gray-400 p-3 rounded-xl shadow-md">
            {children}
        </div>
    );
}

export default Card;