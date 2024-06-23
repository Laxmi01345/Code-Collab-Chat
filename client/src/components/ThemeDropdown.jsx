
import monacoThemes from "../constants/Themes";
const ThemeDropdown = () => {
    return (
        <div>
            <select
                className="border-2 border-black p-2 mx-10 m-4 rounded-md"

            >
                {Object.entries(monacoThemes).map(([themeId, themeName]) => (
                    <option key={themeId} value={themeId}>
                        {themeName}
                        
                    </option>
                ))}
            </select>
        </div>
    )
}

export default ThemeDropdown
