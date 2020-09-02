const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    { id: 1, name: 'course 01' },
    { id: 2, name: 'course 02' },
    { id: 3, name: 'course 03' }
];

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body); // the same than: validation.error
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    // >>> Look up the course
    // If not existing, return  404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send('Course with the given ID was now found');
    }

    // >>> Validate
    // If invalid, return 400 - Bad request
    const { error } = validateCourse(req.body); // the same than: validation.error
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    // >>> Update course
    course.name = req.body.name;
    // Return updated course
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    // >>> Look up the course
    // If not existing, return  404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send('Course with the given ID was now found');
    }

    // Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    // Return the same course
    res.send(course);
});

// Validation function
function validateCourse(course) {
    const schema = Joi.object({ name: Joi.string().min(3).required() });
    return schema.validate(course);
}

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send('Course with the given ID was now found');
    }
    res.send(course);
});

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
