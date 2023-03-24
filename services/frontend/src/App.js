import logo from './logo.svg';
import './App.css';
import TTK from "./components/text2key/TTK";
import {createTheme, ThemeProvider} from "@mui/material";
import {orange} from "@mui/material/colors";

const theme = createTheme({
    palette: {
        mode: 'dark',
    }
});

function App() {
  return (
      <ThemeProvider theme={theme}>
          <div className="App">
              <TTK />
          </div>
      </ThemeProvider>
  );
}

export default App;
