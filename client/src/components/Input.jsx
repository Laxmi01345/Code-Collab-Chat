
export const Input = ({setCustomInput}) => {

    const handleInputChange = (event) => {
        
        setCustomInput(event.target.value);
    };
    return (
        <>
            <div className='text-xl w-80 md:w-96'>
                <span>Input</span>
                <textarea className="border-2 bg-black text-white  text-sm p-2
                
                " cols={60} rows={13} onChange={handleInputChange}></textarea>
            </div>

        </>
    )
}
