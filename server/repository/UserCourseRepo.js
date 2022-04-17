import {db} from '../database/Connection.js';

export async function addCoursesToUser(courses, user) {
    for (let i in courses) {
        await db.run(`
            INSERT INTO user_course (user_id, course_id) 
            VALUES (?, ?)`,
            [user.id, courses[i]]);
    }
}

export async function getUserCourses(user) {
    return await db.all(`
        SELECT * FROM course
        LEFT JOIN user_course uc on course.id = uc.course_id 
        WHERE uc.user_id = ?`, user.id);
}