/* eslint-disable react-refresh/only-export-components */
import { loader } from "@monaco-editor/react";
import Themes from './Themes'

const DefineTheme = (theme) => {
    return new Promise((res) => {
      Promise.all([
        loader.init(),
        import(`monaco-themes/themes/${Themes[theme]}.json`),
      ]).then(([monaco, themeData]) => {
        monaco.editor.defineTheme(theme, themeData);
        res();
      });
    });
  };
  
export default {DefineTheme}