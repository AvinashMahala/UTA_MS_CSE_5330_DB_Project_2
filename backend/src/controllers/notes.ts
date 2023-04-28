// These lines import required libraries, models and functions and declare types of some variables.
import { RequestHandler } from "express";
import NoteModel from "../models/note";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";

// This function gets authenticated user's notes
export const getNotes:RequestHandler = async (req, res, next)=>{
    const authenticatedUserId=req.session.userId;
    
    try {
        
        // Check that authenticated user id is defined
        assertIsDefined(authenticatedUserId);

        // Get notes from the database for the authenticated user id and send them as response
        const notes = await NoteModel.find({userId: authenticatedUserId}).exec();
        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
}

// This function gets a specified note belonging to the authenticated user
export const getNote:RequestHandler = async (req, res, next)=>{
    const noteId=req.params.noteId;
    const authenticatedUserId=req.session.userId;
    
    try {

        // Check that authenticated user id is defined
        assertIsDefined(authenticatedUserId);

        // Check if note id is valid or not.
        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400,"Invalid Note ID!");
        }

        // Find note in the database with the given note id.
        const note=await NoteModel.findById(noteId).exec();
        
        // Throw 404 error if note is not found.
        if(!note){
            throw createHttpError(404,"Note not Found!");
        }

        // Check if authenticated user has access to this note or not.
        if(!note.userId.equals(authenticatedUserId)){
            throw createHttpError(401,"You cannot access this note.");
        }
        
        // Send the requested note as response if everything is good.
        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
};

// This function creates a new note for authenticated user
interface CreateNoteBody{
    title?: string,
    text?: string,
}
export const createNote: RequestHandler<unknown, unknown, CreateNoteBody, unknown> = async (req, res, next)=>{
    
    // Extract title, text and authenticated user id from request body and session respectively.
    const title = req.body.title;
    const text = req.body.text;
    const authenticatedUserId=req.session.userId;
    
    try {
        // Check that authenticated user id is defined
        assertIsDefined(authenticatedUserId);

        // Throw an error if the new note does not have a title.
        if(!title){
            throw createHttpError(400,"Note must have a title!");
        }

        // Create new note in the database and send it as response
        const newNote=await NoteModel.create({
            userId: authenticatedUserId,
            title: title,
            text: text,
        });
        res.status(201).json(newNote);        
    } catch (error) {
        next(error);
    }
};


// This function updates a specified note belonging to the authenticated user
interface UpdateNoteParams{
    noteId: string,
}

interface updateNoteBody{
    title?: string,
    text?: string,
}
export const updateNote:RequestHandler<UpdateNoteParams, unknown, updateNoteBody, unknown> = async(req,res,next)=>{
    const noteId=req.params.noteId;
    const newTitle = req.body.title;
    const newText = req.body.text;
    const authenticatedUserId=req.session.userId;
    try {
        // Check that authenticated user id is defined
        assertIsDefined(authenticatedUserId);

        // Check if note id is valid or not
        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400,"Invalid Note ID!");
        }

        // Throw an error if the updated note does not have a title
        if(!newTitle){
            throw createHttpError(400,"Note must have a title!");
        }

        // Get the note from the database with the given note id.
        const note = await NoteModel.findById(noteId).exec();

        // Throw 404 error if note is not found.
        if(!note){
            throw createHttpError(404,"Note not Found!");
        }

        // Check if authenticated user has access to this note or not.
        if(!note.userId.equals(authenticatedUserId)){
            throw createHttpError(401,"You cannot access this note.");
        }

        // Update the title and/or text of the note and Save the changes to the database and send the updated note as response if everything is good.
        note.title=newTitle;
        note.text=newText;

        const updatedNote=await note.save();
        res.status(200).json(updatedNote);
    } catch (error) {
        next(error);
    }
};

// This function deletes a specified note belonging to the authenticated user.
export const deleteNote: RequestHandler = async(req,res,next)=>{
    const noteId=req.params.noteId;
    const authenticatedUserId=req.session.userId;
    try {
        // Check that authenticated user id is defined
        assertIsDefined(authenticatedUserId);

        // Check if note id is valid or not
        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400,"Invalid note id.");
        }

        // Find the note in the database with the given note id.
        const note = await NoteModel.findById(noteId).exec();

        // Throw 404 error if note is not found.
        if(!note){
            throw createHttpError(404,"Note Not Found!");
        }

        // Check if authenticated user has access to this note or not.
        if(!note.userId.equals(authenticatedUserId)){
            throw createHttpError(401,"You cannot access this note.");
        }

        // Delete the note from database and send 204 status code as response if everything is good.
        await note.deleteOne();

        res.sendStatus(204);
        
    } catch (error) {
        next(error);
    }
};
