//configurando o servidor
const express = require("express")
const server = express()


//configurar servidor para apresentar arquivos estaticos(css, logo e script)
server.use(express.static('public'))

//habilitar body do formulário
server.use(express.urlencoded({extended:true}))


//configurar conexão com banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password:'0000',
    host: 'localhost',
    port:5432,
    database: 'doe'
})


//configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./",{
    express: server,
    noCache: true,
})



//configurar a apresentação da pagina


 server.get("/",  function(req, res){

    db.query("Select * from donors",function(err, result){
        if(err)return res.send("erro no banco de dados.")

        const donors=result.rows
        return res.render("index.html", {donors})
    })
    
     

 })


//receber os dados do formulario
server.post("/",function(req,res){
    //pegar dados do form
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    //se algum dado igual a nulo 
    if(name==""|| email==""|| blood==""){
       return res.send("Todos os campos são obrigatórios.")
    }

//valores dentro do banco de dados
const query =`INSERT INTO donors ("name","email","blood")
VALUES ($1,$2,$3)`
const values = [name,email,blood]
db.query(query, values, function(err){

   //fluxo de erro
   if(err)return res.send("erro no banco de dados.")

   //fluxo ideal
return res.redirect("/")
})

    
})
//start servidor e permissão de acesso na porta 3000
server.listen(3000,function(){
    console.log("iniciei o servidor")
})