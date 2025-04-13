import { AuthProvider } from "./context/AuthContext";
import NavigationStack from "./navigation/navigation";

const App = () => {
    return(
        <AuthProvider>
            <NavigationStack />
        </AuthProvider>
    )
}
export default App;