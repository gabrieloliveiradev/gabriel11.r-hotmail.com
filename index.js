const express = require('express') //importando o express
const bodyParser = require('body-parser')
const fs = require('fs') // importando o fileSystem, módulo de leitura e escrita de arquivos pra poder ler aqui nessa aplicação o arquivo books.json
const app = express () // inicializando o express

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json()) //usando o body-parser pra converter o que o usuario me mandar em json

let rawbooks = fs.readFileSync('books.json') // lendo e armazenando o arquivo books.json e dizendo aqui que meu programa só pode continuar após ler o arquivo books.json por completo
let books = JSON.parse(rawbooks) //convertendo o conteudo da variável rawbooks pra o formato json

app.get('/', (req, res) => {
    res.send("Teste!")
}) // quando acessar a porta raiz (localhost) ele vai retornar um "Ola Mundo!"
app.get('/book', (req, res) => {
    res.json(books)
})

app.post('/book', (req, res) => {
    const book = req.body;
    if (Array.isArray(book)){
        for (item of book){ // verificando se o usuario está mandando um ou mais livros pro cadastro
            books.push(item) //sendo um Array, ele pega cada item desse array e cadastro ao final do meu array books (ele não pega o array todo ele separa em itens e cadastra cada um no array books)
        }
    }
    else {
        books.push(book) // caso não seja um array ele apenas cadastra em books
    }
    let jsonList = JSON.stringify(books) // pega os dados que estão dentro da variável books, tranforma em string e armazena na variável jsonList
    fs.writeFile('books.json', jsonList, 'utf8', ()=>{}) //pegando o que está na variavel jsonList e escrevendo esse conteúdo no arquivo books.json, e informando que essa string que está sendo enviado está no padrão utf-8
    res.send('Book registered succesfully')
})

app.get('/book/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    for(let book of books){
        if (book.isbn === isbn ){
            res.json(book)
            return
        }
    }
    res.status(404).send('Book not found')
})

app.listen(2500) // definindo qual porta vai ser acessada pra pra retornar esse Ola Mundo, nesse caso defini a 3000 (localhost:3000)