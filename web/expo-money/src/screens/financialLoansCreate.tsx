import { Dimensions, TouchableOpacity, View } from "react-native"
import BaseScreens from "./BaseScreens"
import TextComponent from "../components/text/text"
import { textColorPrimary } from "../constants/colorsPalette "
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
import { FinancialLoansCreateDTO } from "../types/financialLoansCreateDTO"


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
        setSimulator(false)
        setCustomerDTO([])
        setFilter("")
        setShowDropDow(false)
        setCustomerId("")
        setFinancialLoans({} as FinancialLoans)
    }

    function handlerFinancialLoasnCreate() {
        const createDTO : FinancialLoansCreateDTO = {
            value: Number.parseFloat(value.replace(".","").replace(",",".")),
            rate: Number.parseFloat(rate.replace(".","").replace(",",".")),
            lateInterest: Number.parseFloat(lateInterest.replace(".","").replace(",",".")),
            startDateDue: startDateDue,
            cashInstallment: Number.parseFloat(cashInstallment),
            customerId: customerId,
            simulator: simulator,
            additionForDaysOfDelay: Number.parseFloat(additionForDaysOfDelay.replace(".","").replace(",","."))
        }

        api.post('/financial', createDTO).then((response) => {
            setFinancialLoans(response.data)
            alert(JSON.stringify(response.data))
        }).catch((error) => {
            alert(JSON.stringify(error))
        })
  
    }

    useEffect(() => {
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
    },[filter])

    return(
        <BaseScreens title=" ">
            <View style={{ width: width, alignItems:"center", gap: 20, padding: 20 }}>
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
                        onChangeText={(text) => { setRate(text)}}
                    />

                </View>

                <View style={{ width: width, display:"flex", flexDirection:"row", gap: 20, justifyContent: "center", alignItems: "center"}}>
                    <InputText 
                        editable
                        label="Juros Atraso *" 
                        keyboardType="numeric"
                        value={lateInterest}
                        width={150}
                        onChangeText={(text) => {setLateInterest(text)}}
                    />

                    <InputText 
                        editable
                        label="Adcional Por Dia Atraso *" 
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

                <View  style={{ width: width, display:"flex", flexDirection:"row", gap: 20, justifyContent: "center", alignItems: "flex-end"}}>
                   
                    <ButtonComponent 
                        nameButton={simulator ? "SIMULANDO" : "EMPRESTIMO"} 
                        onPress={()=> {setSimulator(!simulator)} } 
                        typeButton={ simulator ? "primary" : "success"} 
                        width={"40%"} 
                    />

                    <ButtonComponent 
                        nameButton={"CRIAR"} 
                        onPress={()=> {handlerFinancialLoasnCreate()} } 
                        typeButton={"primary"} 
                        width={"40%"} 
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

                <ButtonComponent nameButton={"LIMPAR"} onPress={()=> { handlerCleanFinancial()} } typeButton={"warning"} width={"100%"} />
            </View>
        </BaseScreens>
    )
}
export default FinancialLoansCreate