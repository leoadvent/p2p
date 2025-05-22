import { useRoute } from "@react-navigation/native";
import BaseScreens from "./BaseScreens";
import { FlatList, TouchableOpacity, View } from "react-native";
import TextComponent from "../components/text/text";
import { backgroundPrimary, backgroundSecondary, backgroundSolid, flatListBorderColor, textColorDeactivated, textColorPrimary, textColorSuccess, textColorWarning } from "../constants/colorsPalette ";
import { stylesGlobal } from "../constants/styles";
import { useEffect, useState } from "react";
import { FinancialLoans } from "../types/financialLoans";
import api from "../integration/axiosconfig";
import { Ionicons } from "@expo/vector-icons";

const ExecutedPledgeByCustomer = () => {

    const route = useRoute();
    const { nameCustomer, idCustomer } : any = route.params;

    const [financialLoansPledge, setFinancialLoansPledge] = useState<FinancialLoans[]>([]);
    const [showDetails, setShowDetails] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await api.get<FinancialLoans[]>(`financial/findExecutedPledgeByCustomer/${idCustomer}`);
                console.log("Data fetched:", data.data);
                setFinancialLoansPledge(data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    },[idCustomer])

    return (
        <BaseScreens backgroundColor={backgroundPrimary} title="GARANTIAS EXECUTADOS" rolbackStack>
            <View style={ stylesGlobal.viewComponentBaseScree}>
                <TextComponent text={`Cliente: ${nameCustomer}`} color={textColorPrimary} fontSize={14} textAlign={"center"}/>

                <FlatList 
                    data={financialLoansPledge}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View id={item.id} style={{ 
                                display:"flex", 
                                flexDirection:"column",
                                gap:10, 
                                width:"100%", 
                                justifyContent:"space-between", 
                                alignItems:"center",
                                padding: 10,
                                borderWidth: 1, 
                                marginBottom: 20,
                                borderBottomColor: flatListBorderColor,
                                borderRadius: 5,
                        }}>
                            <TouchableOpacity onPress={() => setShowDetails(item.id === showDetails ? "" : item.id)}>
                                <View style={{display:"flex", flexDirection:"row", gap: 10, width:"100%", justifyContent:"space-between", alignItems:"center", marginBottom: 10}}>
                                    <Ionicons name="ribbon-outline" size={15} color={textColorDeactivated}/>
                                    <TextComponent text={`Contrato: ${item.id.slice(0, item.id.indexOf('-'))}`} color={textColorPrimary} fontSize={14} textAlign={"center"}/>
                                    <Ionicons name="wallet-outline" size={15} color={textColorWarning}/>
                                    <TextComponent text={`Valor: ${item.valueTotalFormat}`} color={textColorPrimary} fontSize={14} textAlign={"center"}/>
                                </View>
                                {item.loansPaids.sort((a, b) => a.portion - b.portion).map((itemPaid) => (
                                    <View id={itemPaid.id} style={{display: showDetails === item.id ? "flex" : "none", flexDirection:"row", gap: 20, width:"100%", justifyContent:"space-between", alignItems:"center", marginBottom: 7}}>
                                        <View style={{display:"flex", flexDirection:"row", gap: 10, alignItems:"center"}}>
                                            <Ionicons name="arrow-redo-outline" size={15} color={itemPaid.amountPaid === itemPaid.currencyValue ? textColorSuccess: textColorWarning}/>
                                            <TextComponent text={`${itemPaid.portion}`} color={textColorPrimary} fontSize={14} textAlign={"center"}/>
                                        </View>
                                        <View style={{display:"flex", flexDirection:"row", gap: 10, alignItems:"center"}}>
                                            <Ionicons name="calendar-number-outline" size={15} color={itemPaid.amountPaid === itemPaid.currencyValue ? textColorSuccess: textColorWarning}/>
                                            <TextComponent text={`${itemPaid.dueDate}`} color={textColorPrimary} fontSize={14} textAlign={"center"}/>
                                        </View>
                                        <View style={{display:"flex", flexDirection:"row", gap: 10, alignItems:"center"}}>
                                            <Ionicons name="cash-outline" size={15} color={itemPaid.amountPaid === itemPaid.currencyValue ? textColorSuccess: textColorWarning}/>
                                            <TextComponent text={`${itemPaid.currencyValueFormat}`} color={textColorPrimary} fontSize={14} textAlign={"center"}/>
                                        </View>
                                    </View>
                                ))}

                                {item.commitmentItems.map((itemCommitment) => (
                                    <View id={itemCommitment.id} style={{
                                        display:"flex", 
                                        flexDirection:"row", 
                                        gap: 10, 
                                        backgroundColor: backgroundSecondary, 
                                        padding: 5,  
                                        width:"100%", 
                                        justifyContent:"space-between", 
                                        alignItems:"center",
                                        borderRadius: 5,
                                        borderWidth: 1,
                                        marginBottom: 7,
                                    }}>
                                        <Ionicons name="bag-handle-outline" size={15} color={textColorWarning}/>
                                        <TextComponent text={`${itemCommitment.nameItem.slice(0,23)}`} color={textColorPrimary} fontSize={12} textAlign={"center"}/>
                                        <TextComponent text={`${itemCommitment.valueItemFormated}`} color={textColorPrimary} fontSize={14} textAlign={"center"}/>
                                    </View>
                                ))}
                            </TouchableOpacity>
                        </View>
                            
                    )}
                />
            </View>
        </BaseScreens>
    )

}
export default ExecutedPledgeByCustomer;