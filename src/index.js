const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
let count = 0;

server.use((req, res, next) => {
  count++;
  console.log("Requests=", count);
  next();
});

function localizeProject(id) {
  for (var i = 0; i < projects.length; i++) {
    if (projects[i].id === id) {
      return i;
    }
  }
}

function checkProjectInArray(req, res, next) {
  const index = localizeProject(req.params.id);
  const project = projects[index];
  if (!project) {
    return res.status(400).json("Project does not exists");
  }

  req.index = index;
  return next();
}

server.post("/projects", (req, res) => {
  const { id, title, tasks } = req.body;
  const project = {
    id: id,
    title: title,
    tasks
  };
  projects.push(project);
  return res.json(project);
});

server.put("/projects/:id", checkProjectInArray, (req, res) => {
  const { title } = req.body;
  projects[req.index].title = title;
  return res.json(projects[req.index]);
});

server.delete("/projects/:id", checkProjectInArray, (req, res) => {
  projects.splice(req.index, 1);
  return res.send();
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.listen(3000);
