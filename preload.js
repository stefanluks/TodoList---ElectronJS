const fs = require("fs");

window.onload = () => {
   
    const formAdd = document.querySelector("#formAdd");
    const inputAdd = document.querySelector(".input-tarefa");
    const tfabertas = document.querySelector(".tarefas-abertas");
    const tfFechadas = document.querySelector(".tarefas-concluidas");
    
    let Tarefas = JSON.parse(fs.readFileSync('./src/tarefas.json'));
    
    formAdd.addEventListener("submit",event => {
        event.preventDefault();
        Tarefas.push({
            tf: inputAdd.value,
            check: false
        });
        inputAdd.value = null;
        Montar();
    });

    Montar();
    function Montar(){

        let abertas = 0, fechadas = 0;
        if(Tarefas.length > 0){
            for(let i = 0; i<Tarefas.length; i++){

                let tarefa = Tarefas[i];

                let li = document.createElement("li");

                let span = document.createElement("span");
                span.innerHTML = tarefa.tf;

                let btns = document.createElement("div");

                let btnDEl = document.createElement("i");
                let btnCHECK = document.createElement("i");

                if(!tarefa.check){
                    btnCHECK.className = "bi bi-check-circle";
                }else{
                    btnCHECK.className = "bi bi-x-circle";
                }

                btnDEl.className = "bi bi-trash3-fill";
                btnDEl.setAttribute('data-bs-toggle','modal');
                btnDEl.setAttribute('data-bs-target','#exampleModal');

                btnCHECK.addEventListener("click", () => {
                    tarefa.check = !tarefa.check;
                    AtualizarTarefasJSON();
                    Montar();
                });

                btnDEl.addEventListener("click", () => {
                    let modal = document.querySelector("#exampleModal");
                    modal.querySelector(".modal-body").textContent = "Deseja realmente exluir a tarefa ("+tarefa.tf+")?";
                    modal.querySelector(".btn-danger").addEventListener("click", () => {
                        let indice = Tarefas.indexOf(tarefa)
                        if(indice != -1 || Tarefas.length == 1) Tarefas.splice(indice,1);
                        modal.querySelector(".btn-secondary").click();
                        AtualizarTarefasJSON();
                        Montar();
                    });
                });

                btns.appendChild(btnCHECK);
                btns.appendChild(btnDEl);

                li.appendChild(span);
                li.appendChild(btns);
                
                if(!tarefa.check){
                    if(abertas == 0) {
                        tfabertas.innerHTML = "<h3>Tarefas Abertas</h3>";
                    }
                    tfabertas.appendChild(li);
                    abertas++;
                }else{
                    if(fechadas == 0) {
                        tfFechadas.innerHTML = "<h3>Tarefas Concluidas</h3>";
                    }
                    tfFechadas.appendChild(li);
                    fechadas++;
                }
                
                if(abertas == 0) tfabertas.innerHTML = `<h3>Tarefas Abertas</h3><span class="container-fluid alert alert-danger">Não há tarefas Abertas!! </span>`;
                if(fechadas == 0) tfFechadas.innerHTML = `<h3>Tarefas Concluidas</h3><span class="container-fluid alert alert-danger">Não há tarefas concluidas! </span>`;
            
                tfabertas.querySelector("h3").textContent = "Tarefas Abertas - "+abertas;
                tfFechadas.querySelector("h3").textContent = "Tarefas Concluidas - "+fechadas;
            }
        }else{
            tfabertas.innerHTML = `<h3>Tarefas Abertas</h3><span class="container-fluid alert alert-danger">Não há tarefas Abertas!! </span>`;
            tfFechadas.innerHTML = `<h3>Tarefas Concluidas</h3><span class="container-fluid alert alert-danger">Não há tarefas concluidas! </span>`;
        }
    }

    function AtualizarTarefasJSON (){
        fs.writeFileSync("./src/tarefas.json",JSON.stringify(Tarefas));
    }
}