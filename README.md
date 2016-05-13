[![MEAN.JS Logo](http://meanjs.org/img/logo-small.png)](http://meanjs.org/)


MEAN.JS é um full-stack JavaScript open-source , o que proporciona um sólido ponto de partida para [MongoDB](http://www.mongodb.org/) , [Node.js](http://www.nodejs.org/) , [Express](http://expressjs.com/), e [AngularJS](http://angularjs.org/). A ideia é resolver os problemas comuns com a conexão dessas estruturas , construir uma estrutura robusta para suportar as necessidades de desenvolvimento diárias e ajudar os desenvolvedores a usar as melhores práticas ao trabalhar com componentes JavaScript.


##Antes de você começar
Antes de começar recomendamos que você leia mais sobre a full-stack [MEAN.JS](http://meanjs.org/).
O pojeto em questão foi desenvolvido utilizando [Yo Generator](http://meanjs.org/generator.html).


## Pré-requisitos
Certifique-se de ter instalado em sua máquina todos os pré-requisitos abaixo:


* **Git** - [Download & Instalação Git](https://git-scm.com/downloads).

* **Node.js** - [Download & Instalação Node.js](https://nodejs.org/en/download/) 
e o gerenciador de pacotes NPM.

* **MongoDB** - [Download & Instalação MongoDB](http://www.mongodb.org/downloads).

* **Ruby** - [Download & Instalação Ruby](https://www.ruby-lang.org/en/documentation/installation/)

* **Bower** - O [Bower Package Manager](http://bower.io/) é utilizado para gerenciar os pacotes de front-end. 

```bash
$ npm install -g bower
```

* **Grunt** - O [Grunt Task Runner](http://gruntjs.com/) é utilizado para automatizar o  processo de desenvolvimento. 

* **Sass** - O [Sass]( http://sass-lang.com/ ) é utilizado para compilar arquivos CSS.

* **ngMask** - Utilizado para a criação de máscaras nos campos input, o [ngMask](https://github.com/candreoliveira/ngMask) foi escolhido por ter opções de salvar os dados com as pontuações pertinentes ao campo, ex: CEP - "89500-000". Deste modo não é necessário formatar o json para exibi-lo na tela.

* **OSWAP** - O pacote [owasp-password-strength-test-pt-br](https://github.com/jeancarlosdanese/owasp-password-strength-test-pt-BR) é um projeto com as mensagens traduzidas para português Brazil do testador de força de senha de autoria de [Chris Allen Lane owasp-password-strength-test](https://github.com/nowsecure/owasp-password-strength-test).

* **1. Instalação com NPM**

```bash
$ npm install owasp-password-strength-test-pt-br --save
```

* **2. Instalação com BOWER**

```bash
$ bower install owasp-password-strength-test-pt-br --save
```

* **Mongoose-auto-increment** - O plugin [mongoose-auto-increment](https://www.npmjs.com/package/mongoose-auto-increment) é um pacote NPM que permite criar números sequenciais para campos de schema mongoose.