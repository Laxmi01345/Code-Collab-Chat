

import LanguageOptions from '../constants/Language';

const LangDropdown = ({onSelectChange}) => {

  const handleLangChange=(e)=>{

    onSelectChange(e.target.value)
  }
  return (
    <div >
      <select className='border-2 border-black p-2 md:mx-10 m-4 rounded-md w-44 ' onClick={handleLangChange}>
       
        {LanguageOptions.map(option => (
          <option  key={option.id} value={option.value} 
          
          >
            {option.language}
          </option>
        ))}
      </select>
      
    </div>
  );
}

export default LangDropdown;
