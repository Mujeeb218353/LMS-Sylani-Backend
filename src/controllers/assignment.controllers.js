import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import { Teacher } from "../models/teacher.model.js"
import { Student } from "../models/student.model.js"
import { Class } from "../models/class.model.js"
import { Assignment } from "../models/assignment.model.js"

const createAssignment = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        lastDate
    } = req.body

    if (!title) {
        throw new apiError(400, "Title is required")
    }

    if (!description) {
        throw new apiError(400, "Description is required")
    }

    if (!lastDate) {
        throw new apiError(400, "Last date is required")
    }

    const teacher = await Teacher.findById({ _id: req.teacher._id })
    const savedClass = await Class.findById({ _id: teacher.instructorOfClass })

    if (!teacher) {
        throw new apiError(404, "Unauthorized user")
    }

    if (!savedClass) {
        throw new apiError(404, "Class not found")
    }


    const assignment = new Assignment({
        assignedBy: req.teacher._id,
        className: savedClass._id,
        title,
        description,
        lastDate
    })
    await assignment.save()

    savedClass.assignments.push(assignment._id)
    await savedClass.save()

    teacher.assignments.push(assignment._id)
    await teacher.save()

    res.status(200).json(new apiResponse(200, assignment, "Assignment created successfully"))
})

const submitAssignment = asyncHandler(async (req, res) => {
    const { assignmentLink, assignmentId } = req.body

    if (!assignmentLink) {
        throw new apiError(400, "Assignment link is required")
    }

    const student = await Student.findById({ _id: req.student._id })
    const savedClass = await Class.findById({ _id: student.enrolledInClass })
    const assignment = await Assignment.findById({ _id: assignmentId })
    const alreadySubmitted = assignment.submittedBy.find((student) => student.studentId.toString() === req.student._id.toString())

    if (!student) {
        throw new apiError(404, "Unauthorized user")
    }

    if (!savedClass) {
        throw new apiError(404, "Class not found")
    }

    if (!assignment) {
        throw new apiError(404, "Assignment not found")
    }

    if (alreadySubmitted) {
        throw new apiError(400, "Assignment already submitted")
    }

    assignment.submittedBy.push({
        studentId: req.student._id,
        link: assignmentLink,
    });

    await assignment.save()

    res.status(200).json(new apiResponse(200, null, "Assignment submitted successfully"))
})

const editSubmittedAssignment = asyncHandler(async (req, res) => {

})

const getCreatedAssignment = asyncHandler(async (req, res) => {

})

const editAssignment = asyncHandler(async (req, res) => {

})

const deleteAssignment = asyncHandler(async (req, res) => {

})

const getUnSubmittedAssignment = asyncHandler(async (req, res) => {

    const savedClass = await Class.findById({ _id: req.student.enrolledInClass })
    const assignments = await Assignment.find({ className: savedClass._id })

    const unSubmittedAssignment = assignments.filter((assignment) => !assignment.submittedBy.find((student) => student.studentId.toString() === req.student._id.toString()))

    res.status(200).json(new apiResponse (200, unSubmittedAssignment, "Assignment fetched successfully"))
})

const getSubmittedAssignment = asyncHandler(async (req, res) => {
    const savedClass = await Class.findById({ _id: req.student.enrolledInClass })
    const assignments = await Assignment.find({ className: savedClass._id })
    const submittedAssignment = assignments.filter((assignment) => assignment.submittedBy.find((student) => student.studentId.toString() === req.student._id.toString()))

    res.status(200).json(new apiResponse(200, submittedAssignment, "Assignment fetched successfully"))
})

export {
    createAssignment,
    submitAssignment,
    getUnSubmittedAssignment,
    getSubmittedAssignment,
    editSubmittedAssignment,
    getCreatedAssignment,
    editAssignment,
    deleteAssignment,
}