/* eslint-disable react/no-unknown-property */
import { BeatLoader } from 'react-spinners'
import { useContext } from 'react';
import OutputContext from "./OutputContext"
import { useProcessing } from "./ProcessingContext";
export const Output = ({ editorRef, language }) => {

    const { processing } = useProcessing();
    const { Output } = useContext(OutputContext);

    console.log(processing)
    return (
        <>
            <div className='text-xl w-80 md:w-96  relative'>
                <span>Output</span>
                <div className="relative">
                    {processing && <div className="absolute inset-0 flex justify-center items-center bg-opacity-75 bg-black">
                        <BeatLoader loading={true} color='white'  />
                    </div>}
                    <textarea
                        className="border-2 bg-black text-white text-sm p-2"
                        value={Output}
                        rows={13} cols={60}

                        readOnly
                    ></textarea>
                </div>
            </div>
        </>
    )
}
