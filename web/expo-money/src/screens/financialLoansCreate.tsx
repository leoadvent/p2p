import { Dimensions, FlatList, ScrollView, TouchableOpacity, View } from "react-native"
import BaseScreens from "./BaseScreens"
import TextComponent from "../components/text/text"
import { flatListBorderColor, textColorPrimary, textColorSuccess, textColorWarning } from "../constants/colorsPalette "
import InputText from "../components/inputText"
import { useEffect, useState } from "react"
import ButtonComponent from "../components/button"
import DropDow from "../components/dropdow"
import { CustomerDTO } from "../types/customerDTO"
import api from "../integration/axiosconfig"
import DateTimePicker from '@react-native-community/datetimepicker'
import { Platform } from 'react-native'
import { useRoute } from "@react-navigation/native"
import { FinancialLoans } from "../types/financialLoans"
import { FinancialLoansCreateDTO, ModalityFinancing } from "../types/financialLoansCreateDTO"
import { Ionicons } from "@expo/vector-icons"


const FinancialLoansCreate = () => {

    const route = useRoute();
    const { customer } : any = route.params;

    const param : boolean = Object.entries(customer).length > 0 ? true : false;  

    const [simulator, setSimulator] = useState<boolean>(true)
    const [customerDTO, setCustomerDTO] = useState<CustomerDTO[]>([])
    const [filter, setFilter] = useState<string>(param ? `${customer.firsName} ${customer.lastName}` : "")
    const [showDropdow, setShowDropDow] = useState<boolean>(false)
    const [customerId, setCustomerId] = useState<string>(param ? customer.id : "")
    const [financialLoans, setFinancialLoans] = useState<FinancialLoans>({} as FinancialLoans)

    const [value, setValue] = useState<string>("")
    const [rate, setRate] = useState<string>("")
    const [lateInterest, setLateInterest] = useState<string>("")
    const [additionForDaysOfDelay, setAdditionForDaysOfDelay] = useState<string>("")
    const [cashInstallment, setCashInstallment] = useState<string>("")

    const [modalityFinancing, setModalityFinancing] = useState<ModalityFinancing>(ModalityFinancing.FINANCING)
    const [onerousLoanValue, setOnerousLoanValue] = useState<string>("")

    const [showPicker, setShowPicker] = useState(false)
    const [startDateDue, setStartDateDue] = useState(new Date())
    

    const width = Dimensions.get("window").width

    function handlerCleanFinancial(){
        setValue("")
        setRate("")
        setLateInterest("")
        setAdditionForDaysOfDelay("")
        setCashInstallment("")
        setShowPicker(false)
        setStartDateDue(new Date())
        setSimulator(true)
        setCustomerDTO([])
        setFilter("")
        setShowDropDow(false)
        setCustomerId("")
        setFinancialLoans({} as FinancialLoans)
        setModalityFinancing(ModalityFinancing.FINANCING)
        setOnerousLoanValue("")
    }

    function handlerFinancialLoasnCreate(simulatorParam: boolean) {

        const valuelateInterest = modalityFinancing === ModalityFinancing.FINANCING ? lateInterest : rate;

        const createDTO : FinancialLoansCreateDTO = {
            value: Number.parseFloat(value.replace(".","").replace(",",".")),
            rate: Number.parseFloat(rate.replace(".","").replace(",",".").replace("%","")),
            lateInterest: Number.parseFloat(valuelateInterest.replace(".","").replace(",",".").replace("%","")),
            startDateDue: startDateDue,
            cashInstallment: Number.parseFloat(cashInstallment),
            customerId: customerId,
            simulator: simulatorParam,
            additionForDaysOfDelay: Number.parseFloat(additionForDaysOfDelay.replace(".","").replace(",",".")),
            modalityFinancing: modalityFinancing === ModalityFinancing.FINANCING ? 'FINANCING' : 'ONEROUS_LOAN',
            onerousLoanValue:  Number.parseFloat(onerousLoanValue.replace(".","").replace(",",".")),
        }

        api.post('/financial', createDTO).then((response) => {
            setFinancialLoans(response.data)
        }).catch((error) => {
            alert(JSON.stringify(error))
        })
  
    }

    useEffect(() => {
        handlerCleanFinancial();
        setFilter(customer === undefined ? "" : `${customer.firsName} ${customer.lastName}`)
        setCustomerId(customer === undefined ? "" : customer.id)
    },[customer])

    useEffect(() => {
        if(filter.length === 0) {
            setCustomerDTO([])
            setShowDropDow(false)
            return
        }
        setShowDropDow(true)
        api.post("/customer/filterByNome", filter).then((response) => {
            if(response.data.length === 0) {setShowDropDow(false)}
            setCustomerDTO(response.data)
        })
    },[filter, customer])

    return(
        <BaseScreens title=" ">
            <>
                <View style={{ display: Object.entries(financialLoans).length === 0 ? "flex" : "none", width: width, alignItems:"center", gap: 20, padding: 20 }}>
                    <TextComponent text="Criando Empréstimo" color={textColorPrimary} fontSize={20} textAlign={"auto"} />
                    
                    <InputText 
                        label="Cliente *" 
                        value={filter}
                        width={330}
                        editable
                        onChangeText={(text) => setFilter(text) }
                    />
                    <DropDow display={showDropdow ? "flex" : "none"} width={330} top={139}> 
                        <View style={{ gap: 10, padding: 10}}>
                            {customerDTO && customerDTO.map((item, key) => (
                                <TouchableOpacity 
                                    onPress={() => { setShowDropDow(false), setFilter(item.firsName + " " + item.lastName), setCustomerId(item.id)}}
                                >
                                    <TextComponent key={key.toString()} text={item.firsName + " " + item.lastName} color={"rgb(36, 36, 36)"} fontSize={20} textAlign={"auto"} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </DropDow>

                    <View style={{width: width - 50}}>
                        <ButtonComponent nameButton={`TIPO: ${modalityFinancing.toUpperCase()}`} onPress={()=> {setModalityFinancing(modalityFinancing === ModalityFinancing.FINANCING ? ModalityFinancing.ONEROUS_LOAN : ModalityFinancing.FINANCING)} } typeButton={"primary"} width={"100%"} />
                    </View>

                    <View style={{ width: width, display:"flex", flexDirection:"row", gap: 20, justifyContent: "center", alignItems: "center"}}>

                        <InputText 
                            editable
                            label="Valor *" 
                            money={true}
                            keyboardType="numeric"
                            value={value}
                            width={150}
                            onChangeText={(text) => {setValue(text)}}
                        />

                        <InputText 
                            editable
                            label="Juros Empréstimo *" 
                            keyboardType="numeric"
                            value={rate}
                            width={150}
                            percentage
                            onChangeText={(text) => { setRate(text)}}
                        />

                    </View>

                    <View style={{ width: width, display:"flex", flexDirection:"row", gap: 20, justifyContent: "center", alignItems: "center"}}>
                        
                        {modalityFinancing === ModalityFinancing.FINANCING &&
                            <InputText 
                                editable
                                label="Juros Atraso *" 
                                keyboardType="numeric"
                                value={lateInterest}
                                width={150}
                                percentage
                                onChangeText={(text) => {setLateInterest(text)}}
                            />
                        }

                        { modalityFinancing === ModalityFinancing.ONEROUS_LOAN &&
                            <InputText 
                            editable
                            label="Valor Aluguel *" 
                            money
                            keyboardType="numeric"
                            value={onerousLoanValue}
                            width={150}
                            onChangeText={(text) => { setOnerousLoanValue(text)}}
                        />
                        }

                        <InputText 
                            editable
                            label="Adicional Por Dia Atraso *" 
                            money
                            keyboardType="numeric"
                            value={additionForDaysOfDelay}
                            width={150}
                            onChangeText={(text) => { setAdditionForDaysOfDelay(text)}}
                        />
                    </View>

                    <View style={{ width: width, display:"flex", flexDirection:"row", gap: 20, justifyContent: "center", alignItems: "flex-end"}}>
                        
                        <InputText 
                            editable
                            label="Quantidade Parcelas *" 
                            keyboardType="numeric"
                            value={cashInstallment}
                            width={150}
                            onChangeText={(text) => { setCashInstallment(text)}}
                        />

                        <TouchableOpacity
                            onPress={() => setShowPicker(true)}
                        >
                            <InputText 
                                label="Data Início"
                                editable={false}
                                width={150}
                                value={startDateDue.toLocaleDateString('pt-BR')}
                            />
                        </TouchableOpacity>

                        {showPicker && (
                            <DateTimePicker
                                value={startDateDue}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                                onChange={(event, selectedDate) => {
                                setShowPicker(false)
                                if (selectedDate) setStartDateDue(selectedDate)
                                }}
                            />
                        )}

                    
                    </View>

                    <View  style={{ width: width-50, display:"flex", flexDirection:"row", gap: 20, justifyContent: "center", alignItems: "flex-end"}}>
                    
                        <ButtonComponent 
                            nameButton={"PROSSEGUIR"} 
                            onPress={()=> {handlerFinancialLoasnCreate(true)} } 
                            typeButton={"primary"} 
                            width={"100%"} 
                            isDisabled={
                                (customerId              === "" || customerId                === null) &&
                                (value                   === "" || value                     === null) &&
                                (rate                    === "" || rate                      === null) &&
                                (lateInterest            === "" || lateInterest              === null) &&
                                (additionForDaysOfDelay  === "" || additionForDaysOfDelay    === null) &&
                                (cashInstallment         === "" || cashInstallment           === null) &&
                                startDateDue            === undefined
                            }
                        />
                        
                    </View>
                </View>
                {Object.entries(financialLoans).length > 0 && 

                    <View style={{ 
                            display: Object.entries(financialLoans).length > 0 ? "flex" : "none", 
                            marginTop: 10,
                            width: width, 
                            alignItems:"center", 
                            alignContent:"center",
                            justifyContent:"center",
                            gap: 20
                    }}>
                        <TextComponent text="Dados do Empréstimo" color={textColorPrimary} fontSize={20} textAlign={"auto"} />

                        <TextComponent text={`${financialLoans.customer.firsName} ${financialLoans.customer.lastName}`} color={textColorPrimary} fontSize={16} textAlign={"auto"} />

                       
                        <View style={{ display: "flex", flexDirection:"row", justifyContent:"space-between", gap:20, alignItems:"center" }}>
                            <Ionicons name="calendar-number-outline" size={15} color={textColorWarning}/>
                            <TextComponent text={`Adicional por dia de atraso: ${financialLoans.additionForDaysOfDelayFormat}`} color={textColorPrimary} fontSize={12} textAlign={"auto"} />
                        </View>

                        <View style={{ display: "flex", flexDirection:"row", justifyContent:"space-between", gap:20, alignItems:"center" }}>
                            <Ionicons name="pricetag-outline" size={15} color={textColorWarning}/>
                            <TextComponent text={`Juros: ${financialLoans.rate}%`} color={textColorPrimary} fontSize={12} textAlign={"auto"} />
                            <TextComponent text={`Em Atraso: ${financialLoans.lateInterest}%`} color={textColorPrimary} fontSize={12} textAlign={"auto"} />
                        </View>

                        <View style={{ display: "flex", flexDirection:"row", justifyContent:"space-between", gap:20 }}>
                            <Ionicons name="wallet-outline" size={15} color={textColorWarning}/>
                            <TextComponent text={`Valor: ${financialLoans.valueFormat}`} color={textColorPrimary} fontSize={14} textAlign={"auto"} />
                            <TextComponent text={`Total: ${financialLoans.valueTotalFormat}`} color={textColorPrimary} fontSize={14} textAlign={"auto"} />
                        </View>

                        <ScrollView  style={{ height: 300, padding: 20, gap: 20 }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: "center", padding: 20 }}>
                            <FlatList 
                                data={financialLoans.loansPaids}
                                keyExtractor={(key) => key.toString()}
                                renderItem={({item}) => (
                                    <View style={{ 
                                        display:"flex", 
                                        width: width-80, 
                                        flexDirection:"row", 
                                        alignContent:"space-between", 
                                        justifyContent:"space-between",
                                        paddingTop: 15,
                                        paddingInline: 20,
                                        paddingBottom: 5,
                                        borderWidth:1,
                                        borderRadius: 10,
                                        marginBottom: 10,
                                        borderBottomColor: flatListBorderColor,
                                    }}>
                                        <Ionicons name="return-up-forward-outline" size={15} color={textColorWarning}/>
                                        <TextComponent 
                                            text={`${item.portion}º`}
                                            color={"rgb(255, 255, 255)"} fontSize={12} textAlign={"center"}
                                        />
                                        <Ionicons name="calendar" size={15} color={textColorWarning}/>
                                        <TextComponent 
                                            text={`${item.dueDate}`}
                                            color={"rgb(255, 255, 255)"} fontSize={12} textAlign={"center"}
                                        />
                                        <Ionicons name="cash" size={15} color={textColorSuccess}/>
                                        <TextComponent 
                                            text={`${item.installmentValueFormat} `} 
                                            color={"rgb(255, 255, 255)"} fontSize={12} textAlign={"center"} />
                                    </View>
                                )}
                            />
                        </ScrollView>

                        {simulator && 
                            <View style={{ display: "flex", flexDirection:"row", gap:20, width: width-70, alignItems:"center"}}>
                                <ButtonComponent nameButton="EDITAR" onPress={()=> {setFinancialLoans({} as FinancialLoans)} } typeButton={"warning"} width={"50%"} />
                                <ButtonComponent nameButton="EMPRESTAR" onPress={()=> {setSimulator(false), handlerFinancialLoasnCreate(false)} } typeButton={"success"} width={"50%"} />
                            </View>
                        }
                        {!simulator &&
                            <View style={{ display: "flex", flexDirection:"row", gap:20, width: width-70, alignItems:"center"}}>
                                <Ionicons name="ribbon-outline" size={18} color={textColorSuccess}/>
                                <TextComponent text={`Contrato Realizado com Sucesso!`} color={textColorPrimary} fontSize={18} textAlign={"center"} />
                            </View>
                        }
                        
                    </View>
                }
                <View style={{ width: width, alignItems:"center", gap: 20, padding: 20 }}>
                    <ButtonComponent nameButton={"LIMPAR"} onPress={()=> { handlerCleanFinancial()} } typeButton={"warning"} width={"100%"} />
                </View>
            </>
        </BaseScreens>
    )
}
export default FinancialLoansCreate