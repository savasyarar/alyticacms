import { Request, Response } from "express";
import { handleCreateUser } from "../controllers/User/userController";
import userModel from "../models/User/userModel";
import bcrypt from "bcrypt";
import {v4 as uuidv4 } from "uuid";

jest.mock('../models/User/userModel');
jest.mock('bcrypt');
jest.mock('uuid', () => {
    v4: jest.fn(() => 'mocked-uuid');
});

describe('handleCreateUser', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
       req = { body: {}, id: '123'},
       statusMock = jest.fn().mockReturnThis();
       jsonMock = jest.fn();
       res = {
           status: statusMock,
           json: jsonMock,
       }
    });

    it('fehler der Benutzer ist nicht valide', async() => {
       req.id = undefined;

       await handleCreateUser(req as Request, res as Response);

       expect(statusMock).toHaveBeenCalledWith(400);
       expect(jsonMock).toHaveBeenCalledWith({
           message: 'Benutzer ist nicht valide'
       });
    });

});