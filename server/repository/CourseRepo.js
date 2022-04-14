import {db} from '../database/Connection.js'

export async function getAllCourses() {
    const data = await db.all('SELECT * FROM course');
    data.forEach(course => {
        course.created_date = new Date(course.created_date+'Z');
        course.updated_date = new Date(course.updated_date+'Z');
    })
    return data;
}

export async function getCoursesById(ids) {
    if (!ids || ids.length === 0) return [];

    let prepared = '';
    ids.forEach(() => prepared += '?,')
    prepared = prepared.slice(0, prepared.length-1);

    return await db.all(`SELECT * FROM course WHERE id IN (${prepared})`, ids);
}

export async function getCourseById(id) {
    return await db.get('SELECT * FROM course WHERE id = ?', id);
}

export async function getCoursesByCategory_id(category_id) {
    const data = await db.all('SELECT * FROM course WHERE category_id = ?', category_id);
    data.forEach(course => {
        course.created_date = new Date(course.created_date+'Z');
        course.updated_date = new Date(course.updated_date+'Z');
    });

    return data;

}

export async function getMostPopularCourses(amount) {
    let courses = await getAllCourses();
    courses = courses.sort((a, b) => b.number_of_purchases - a.number_of_purchases);
    return courses.slice(0, amount)
}

export async function getNewCourses(amount) {
    let courses = await getAllCourses();
    courses = courses.sort((a, b) => b.created_date - a.created_date);
    return courses.slice(0, amount);
}