import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import { Teacher } from "../models/teacher.model.js"
import { Student } from "../models/student.model.js"
import { Class } from "../models/class.model.js"
import { Assignment } from "../models/assignment.model.js"

// Teacher side

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
        assignedDate: Date.now(),
        lastDate,
    })
    await assignment.save()

    savedClass.assignments.push(assignment._id)
    await savedClass.save()

    teacher.assignments.push(assignment._id)
    await teacher.save()

    res.status(200).json(new apiResponse(200, assignment, "Assignment created successfully"))
})


const getCreatedAssignment = asyncHandler(async (req, res) => {

    const teacher = await Teacher.findById({ _id: req.teacher._id })

    if (!teacher) {
        throw new apiError(404, "Unauthorized user")
    }

    const assignments = await Assignment.find({ assignedBy: teacher._id })

    if (!assignments) {
        throw new apiError(404, "Assignments not found")
    }

    res.status(200).json(new apiResponse(200, assignments, "Assignment fetched successfully"));
})

const editAssignment = asyncHandler(async (req, res) => {

})

const deleteAssignment = asyncHandler(async (req, res) => {

})

// Student side

const getUnSubmittedAssignment = asyncHandler(async (req, res) => {

    const savedClass = await Class.findById({ _id: req.student.enrolledInClass })
    const assignments = await Assignment.find({ className: savedClass._id })

    const unSubmittedAssignment = assignments.filter((assignment) => !assignment.submittedBy.find((student) => student.studentId.toString() === req.student._id.toString()))

    res.status(200).json(new apiResponse(200, unSubmittedAssignment, "Assignment fetched successfully"))
})

const getSubmittedAssignment = asyncHandler(async (req, res) => {
    const savedClass = await Class.findById({ _id: req.student.enrolledInClass })
    const assignments = await Assignment.find({ className: savedClass._id })
    const submittedAssignment = assignments.filter((assignment) => assignment.submittedBy.find((student) => student.studentId.toString() === req.student._id.toString()))
    res.status(200).json(new apiResponse(200, submittedAssignment, "Assignment fetched successfully"))
})

const submitAssignment = asyncHandler(async (req, res) => {
    const { assignmentLink, assignmentId } = req.body

    if (!assignmentLink) {
        throw new apiError(400, "Assignment link is required")
    }

    if (!assignmentId) {
        throw new apiError(400, "Assignment not found")
    }
    const assignment = await Assignment.findById({ _id: assignmentId })
    const alreadySubmitted = assignment.submittedBy.find((student) => student.studentId.toString() === req.student._id.toString())


    if (!assignment) {
        throw new apiError(404, "Assignment not found")
    }

    if (alreadySubmitted) {
        throw new apiError(400, "Assignment already submitted")
    }

    const now = new Date();

    assignment.submittedBy.push({
        studentId: req.student._id,
        link: assignmentLink,
        submissionDate: new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    });

    await assignment.save()

    res.status(200).json(new apiResponse(200, assignment, "Assignment submitted successfully"))
})

const editSubmittedAssignment = asyncHandler(async (req, res) => {

    const { assignmentLink } = req.body;
    const { assignmentId } = req.params;

    if (!assignmentLink) {
        throw new apiError(400, "Assignment link is required")
    }

    if (!assignmentId) {
        throw new apiError(400, "Assignment not found")
    }

    const assignment = await Assignment.findById({ _id: assignmentId })

    if (!assignment) {
        throw new apiError(404, "Assignment not found")
    }

    const updateAssignment = assignment.submittedBy.find((student) => student.studentId.toString() === req.student._id.toString())

    if (!updateAssignment) {
        throw new apiError(404, "Assignment not found")
    }

    const now = new Date();

    console.log(now.getTime(), now.getTimezoneOffset());

    updateAssignment.link = assignmentLink
    updateAssignment.submissionDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)

    await assignment.save()

    res.status(200).json(new apiResponse(200, assignment, "Assignment updated successfully"))
})

const deleteSubmittedAssignment = asyncHandler(async (req, res) => {

    const { assignmentId } = req.params;

    console.log(assignmentId);

    if (!assignmentId) {
        throw new apiError(400, "Assignment is required")
    }

    const assignment = await Assignment.findById(assignmentId )

    console.log("cross 1");

    if (!assignment) {
        throw new apiError(404, "Assignment not found")
    }

    console.log("cross 2");
    const submittedIndex = assignment.submittedBy.findIndex(
        (student) => student.studentId.toString() === req.student._id.toString()
    );

    console.log("cross 3");

    if (submittedIndex === -1) {
        throw new apiError(404, "Submitted assignment not found");
    }

    console.log("cross 4");
    const deletedAssignment = assignment.submittedBy.splice(submittedIndex, 1)[0];
    console.log("cross 5");

    await assignment.save();

    res.status(200).json(new apiResponse(200, deletedAssignment, "Assignment deleted successfully"));

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
    deleteSubmittedAssignment,
}