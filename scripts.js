document.addEventListener('DOMContentLoaded', function () {
    // Selecionando elementos do DOM
    const form = document.getElementById('form-tarefas');
    const taskList = document.getElementById('lista-tarefas');

    // Função para carregar tarefas do localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            addTaskToDOM(task);
        });
    }

    // Função para salvar tarefas no localStorage
    function saveTaskToLocalStorage(task) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        task.id = Date.now(); // Adicionando um identificador único para a tarefa
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Função para remover tarefa do localStorage
    function removeTaskFromLocalStorage(taskIdToRemove) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => task.id !== taskIdToRemove);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function completeTaskInLocalStorage(taskIdToComplete) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            if (task.id === taskIdToComplete) {
                task.completed = true; // Adicionando uma propriedade 'completed' à tarefa para indicar que foi concluída
            }
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Função para adicionar tarefa ao DOM
    function addTaskToDOM(task) {
        const li = document.createElement('li');
        li.className = 'task-item'
        li.innerHTML = `
        <strong>${task.title}</strong> - 
        <span>${task.date}</span> - 
        <span>${task.time}</span><br>
        <span>${task.description}</span>
        <div class="button-container">
        <button class="remove-btn">Remover</button>
        <button class="complete-btn">Concluir</button>
        </div>
      `;

        // Verificando se a tarefa está concluída no localStorage e aplicando o estilo adequado
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const taskInLocalStorage = tasks.find(t => t.id === task.id);
        if (taskInLocalStorage && taskInLocalStorage.completed) {
            li.style.textDecoration = 'line-through';
        }

        taskList.appendChild(li);

        // Adicionando evento de remoção da tarefa
        const removeBtn = li.querySelector('.remove-btn');
        removeBtn.addEventListener('click', () => {
            li.remove();
            removeTaskFromLocalStorage(task.id); // Passando o identificador único para remover a tarefa
        });

        // Adicionando evento de conclusão da tarefa
        const completeBtn = li.querySelector('.complete-btn');
        completeBtn.addEventListener('click', () => {
            li.style.textDecoration = 'line-through';
            completeTaskInLocalStorage(task.id); // Passando o identificador único para concluir a tarefa
        });
    }

    // Carregando tarefas ao carregar a página
    loadTasks();

    // Evento de submissão do formulário
    form.addEventListener('submit', e => {
        e.preventDefault();
        const title = document.getElementById('titulo-tarefa').value;
        const date = document.getElementById('data-tarefa').value;
        const time = document.getElementById('tempo-tarefa').value;
        const description = document.getElementById('descricao-tarefa').value;

        const task = {
            title,
            date,
            time,
            description
        };

        addTaskToDOM(task);
        saveTaskToLocalStorage(task);

        // Limpar campos do formulário
        form.reset();
    });
});

document.addEventListener("DOMContentLoaded", function() {
    loadRepos();
});

document.getElementById("form-repositorios").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita que o formulário seja submetido

    const usuario = document.getElementById("usuario").value;
    const url = `https://api.github.com/users/${usuario}/repos`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha ao buscar repositórios');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById("lista-repositorios").innerHTML = "";
            data.forEach(repo => {
                addRepoToDOM(repo);
            });

            saveReposToLocalStorage(data);
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Usuário não encontrado ou ocorreu um erro ao buscar os repositórios.');
        }); 
});

function saveReposToLocalStorage(repos) {
    localStorage.setItem('repos', JSON.stringify(repos));
}

function loadRepos() {
    const repos = JSON.parse(localStorage.getItem('repos')) || [];
    repos.forEach(repo => {
        addRepoToDOM(repo);
    });
}

function addRepoToDOM(repo) {
    const li = document.createElement('li');
    li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
    document.getElementById("lista-repositorios").appendChild(li);
}