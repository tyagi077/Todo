loadTodo()
const arr=[]
function progressWidth(){
    fetchdata().then(userArr=>{
        const checkedobj = userArr.filter((user)=>user.checkbox_value==true)
        const checkedCtn=Object.keys(checkedobj).length
        const len = userArr.length
        if(len==0){
            document.getElementById("progres").style.width=0+"%" 
        }else{
            let prog = (100/len)*checkedCtn
            document.getElementById("progres").style.width=prog+"%"
        }
    })
} 

function progress(index){
    let checkbox =document.getElementById("checkbox"+index)
    let val = checkbox.value
    let checkbox_value;
    if(val=="false"){
        checkbox_value=true;
        checkbox.setAttribute("value","true")
        changeCheckbox(index,checkbox_value);
    }else{
        checkbox_value=false
        checkbox.setAttribute("value","false")
        changeCheckbox(index,checkbox_value);
    }
    progressWidth()
}

function EmptyinputAdd(){
    const input = document.querySelector("input")
    input.value=""
    const button = document.getElementById("addbtn")
    button.innerHTML="Add"
}

async function deleteTodo(index){
    await deleteTodobackend(index)
    render()
    document.querySelector('div[Tempid]').setAttribute('Tempid','false')
    EmptyinputAdd()
    progressWidth()
}

function editTodo(index){
    const input = document.querySelector("input")
    fetchdata().then((userArr)=>{
        input.value=userArr[index].title
    })
    const button = document.getElementById("addbtn")
    button.innerHTML="Edit"
    document.getElementById("")
    document.querySelector('div[Tempid]').setAttribute('Tempid','true')
    document.querySelector('div[Tempid]').setAttribute('data-index', index); 
}

function addNewTodo(){ 
     const tempid=document.querySelector('div[Tempid]').getAttribute('Tempid')
     const index =document.querySelector('div[Tempid]').getAttribute('data-index'); 
     if(tempid!="false"){
        const updatedData=document.querySelector("input").value
        document.querySelector(".spanclass").innerHTML=updatedData
        updateTitle(index,updatedData)
        EmptyinputAdd()
        document.querySelector('div[Tempid]').setAttribute('Tempid','false')
     }else{
        title=document.querySelector("input").value,
        checkbox_value="false"
        arr.push({
            title:title,
            checkbox_value:checkbox_value
        })
        addTobackend(title,checkbox_value)
        const input = document.querySelector("input")
        input.value=""
        render()
        progressWidth()
     }
}

function render() {
    fetchdata().then(userArr => {
        document.querySelector(".ListTodo").innerHTML = "";
        for (let i = 0; i < userArr.length; i++) {
            const div = createTodoComponent(userArr[i].title, userArr[i].checkbox_value, i);
            document.querySelector(".ListTodo").appendChild(div);
        }
    });
}


function createTodoComponent(data,checkbox_value,ctr){
    const div = document.createElement("div")
    const indiv = document.createElement("div")
    const check = document.createElement("input")
    check.setAttribute("type","checkbox")
    check.setAttribute("class","checkbox")
    check.setAttribute("value",checkbox_value)
    check.setAttribute("id","checkbox"+ctr)
    check.checked=JSON.parse(checkbox_value)
    check.setAttribute("onclick",`progress(${ctr})`)
    const Ebutton = document.createElement("button")
    const Dbutton =document.createElement("button")
    indiv.innerHTML=data
    indiv.setAttribute("class","spanclass")
    Ebutton.innerHTML="Edit"
    Dbutton.innerHTML="Delete"
    Ebutton.setAttribute("class","Ebutton")
    Dbutton.setAttribute("class","Dbutton")
    Dbutton.setAttribute("id","d"+ctr)
    Ebutton.setAttribute("id","e"+ctr)
    Dbutton.setAttribute("onclick",`deleteTodo(${ctr})`)
    Ebutton.setAttribute("onclick",`editTodo(${ctr})`)
    div.setAttribute("class","Taskdiv")
    div.append(check)
    div.append(indiv)
    div.append(Ebutton)
    div.append(Dbutton)
    return div
}


async function signup(){
    const username = document.getElementById("signup-username").value
    const password = document.getElementById("signup-password").value
     await axios.post("http://localhost:3000/signup",{
        username:username,
        password:password
     });
     alert("SignUp success")
}
async function signin(){
    const username = document.getElementById("signin-username").value
    const password = document.getElementById("signin-password").value
    const response= await axios.post("http://localhost:3000/signin",{
        username:username,
        password:password
     });
     const token = response.data.token
     if(token){
         localStorage.setItem("token",token)
         loadTodo()
         alert("SignIn success")
     }
    }

    async function loadTodo() {
        const token = localStorage.getItem("token");
    
        if (token) {
            try {
                const response = await axios.get("http://localhost:3000/todo", {
                    headers: { token: token }
                });
    
                document.body.innerHTML=response.data
                render()
                progressWidth()
                
            } catch (error) {
                console.error("Error loading Todo page:", error.response?.data || error.message);
            }
        }
    }
    
    function logout(){
        localStorage.removeItem("token")
        window.location.reload()
        alert("Log out")
    }

    async function addTobackend(title, checkbox_value) {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please log in first.");
            return;
        }
        await axios.post("http://localhost:3000/add", {
            title: title,
            checkbox_value: checkbox_value
        }, { headers: { token: token } })
        .then(response => {
            console.log("Todo added successfully:");
            render(); 
        })
        .catch(error => {
            console.error("Error adding todo:", error.response?.data || error.message);
        });
    }

    async function changeCheckbox(index,checkbox_value) {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please log in first.");
            return;
        }
        await axios.put("http://localhost:3000/updatecheckbox", {
            index :index,
            checkbox_value: checkbox_value
        }, { headers: { token: token } })
        .then(response => {
            console.log("done task");
        })
        .catch(error => {
            console.error(error);
        });
    }
    
    async function updateTitle(index,title) {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please log in first.");
            return;
        }
        await axios.put("http://localhost:3000/updateTitle", {
            index :index,
            title: title
        }, { headers: { token: token } })
        .then(response => {
            console.log("updated title");
        })
        .catch(error => {
            console.error(error);
        });
    }
    

    async function deleteTodobackend(index){
        const token = localStorage.getItem("token");
        return await axios.delete("http://localhost:3000/deletetodo",{
            headers:{token :token},
            data :{index :index}
        })
        .then(response=>{
            console.log("delted successfully");
        })
        .catch(error => {
            console.error(error);
        });
    }
    
    function fetchdata() {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please log in first.");
            return;
        }
        return axios.get("http://localhost:3000/todos",
            { headers: { token: token } }
        )
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });

            
    }

    