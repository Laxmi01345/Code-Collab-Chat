
import Avatar from "react-avatar"
import { useContext } from "react"
import ExpuserContext from "./ExpuserContext"

export const Client = ({ Username }) => {
    const {user} = useContext(ExpuserContext);
    console.log("user :",user)
    return (
        <>

            <div className='grid grid-cols-2 items-center h-24 gap-2 '>
                <div className=' w-16 text-center '>
                <Avatar name={Username ? Username : "user"} size={50} className='rounded-md ' />
                <span className='text-sm text-center font-serif'>{Username ? Username.toString() : "user"}</span>
                </div>
            </div>

        </>
    )
}
