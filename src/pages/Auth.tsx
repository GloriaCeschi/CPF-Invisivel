import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export type User={
    email?:string; 
    pass?:string;
}

export default function Auth(){
     const nav = useNavigate();
     const [tentativa, setTentativa] = useState(0);
  
     const [login, setLogin] = useState(true);

    const [user, setUser] = useState<User>(); 
    const [users, setUsers] = useState<User[]>([])

    function checkedLogin(){
        if(tentativa < 3){
            setTentativa(tentativa+1);
        }else{
            showToast("Volte mais tarde");
            return;
        }

       
        let loged = users.find(u => u.email == user?.email && u.pass === user?.pass)
        if(loged){
            showToast("login realizado");
            nav('/dash');
        }else{
            showToast("Email e senha inválidos")
        }}

    function handleRegister(){
        if(user?.email && user?.pass){
                setUsers([...users, user]);
                showToast("Cadastrado com Sucesso!");
        }else{ showToast("Email e Senha Obrigatorios!");
        } 
    }

    const [pToast, sertPtoast] = useState('');

    function showToast(msg: string) {

        sertPtoast(msg);

        setTimeout(() => {
        sertPtoast('');
        }, 5000);
    }


    return (
        <>
         
        {pToast.length>0 && (
          <div className="toast">
            <p id="toast">{pToast}</p>
          </div>
        )}
            <h1>Página de login</h1>
            <Link to="/"> Voltar </Link>

            <input type="email" onChange={(e) => setUser({...user,email: e.target.value,})} />
            <input type="password" onChange={(e) => setUser({...user, pass: e.target.value})}/>

        {/*teste ? <verdadeiro>  : <falso>*/}

            { login? (<a className="button" onClick={()=> checkedLogin() }>Login {tentativa}</a>
            ):(<a className="button" onClick={()=> handleRegister() }> Cadastre-se </a>)}

            <a className="link" onClick={ ()=> setLogin(!login) }>
                { login? "Clique aqui para fazer o seu Cadastro" 
                : "Clique aqui para fazer o login"}
            </a>
        </>
    )
}