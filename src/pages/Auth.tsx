import { useState } from "react";
import { Link } from "react-router-dom";

export default function Auth(){
     const [tentativa, setTentativa] = useState(0);

    const [login, setLogin] = useState(true);

    const [user, setUser] = useState({
        email: "turma@gmail.com",
        pass: "123456"
    });

    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');


    function checkedLogin(){
        if(tentativa < 3){
            setTentativa(tentativa+1);
        }else{
            alert("Volte mais tarde");
            return;
        }

        //comparando a variável com o objeto.atributo
        //as duas condições precisam ser verdade
        if(email == user.email && pass == user.pass){
            alert("login realizado");
        }else{
            alert("Email e senha inválidos")
        }}

    function handleRegister(){}

    return (
        <>
            <h1>Página de login</h1>
            <Link to="/">Voltar</Link>

            <input type="email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" onChange={(e) => setPass(e.target.value)}/>

        {/*teste ? <verdadeiro>  : <falso>*/}

            { login? (<a className="button" onClick={()=> checkedLogin() }>Login {tentativa}</a>
            ):(<a className="button" onClick={()=> handleRegister() }>Cadastre-se</a>)}

            <a className="link" onClick={ ()=> setLogin(!login) }>
                { login? "Clique aqui para fazer o seu Cadastro" 
                : "Clique aqui para fazer o login"}
            </a>
        </>
    )
}