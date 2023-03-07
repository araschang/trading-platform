from flask import request
from flask_restful import Resource
from Base.Connector import MongoConnector
from Base.ResponseCode import ResponseCode


class MembershipController(Resource):
    def __init__(self):
        self._membershipConnection = MongoConnector().getMembershipConn()

    def get(self):
        '''
        Get a membership's info.
        Data json: email
        '''
        data = request.get_json()
        email = data['email']
        member = self._membershipConnection.find_one({'email': email})
        return member, ResponseCode.SUCCESS if member else ResponseCode.MEMBER_NOT_EXIST
    
    def post(self):
        '''
        Sign up for a membership.
        Data json: email, password
        '''
        data = request.get_json()
        email = data['email']
        password = data['password']
        if self._membershipConnection.find_one({'email': email}):
            return ResponseCode.MEMBER_ALREADY_EXIST
        
        member = {
            'email': email,
            'password': password,
        }
        self._membershipConnection.insert_one(member)
        return ResponseCode.SUCCESS if self._membershipConnection.find_one({'email': email}) else ResponseCode.BAD_REQUEST

    def put(self):
        '''
        Update a membership.
        Data json: email, password
        '''
        data = request.get_json()
        email = data['email']
        password = data['password']
        if not self._membershipConnection.find_one({'email': email}):
            return ResponseCode.MEMBER_NOT_EXIST
        
        member = {
            'email': email,
            'password': password,
        }
        self._membershipConnection.update_one({'email': email}, {'$set': member})
        return ResponseCode.SUCCESS


class MemberLoginController(Resource):
    def __init__(self):
        self._membershipConnection = MongoConnector().getMembershipConn()

    def post(self):
        '''
        Login check.
        Data json: email, password
        '''
        data = request.get_json()
        email = data['email']
        password = data['password']
        member = self._membershipConnection.find_one({'email': email})
        if not member:
            return ResponseCode.MEMBER_NOT_EXIST
        if member['password'] != password:
            return ResponseCode.MEMBER_PASSWORD_ERROR
        else:
            return ResponseCode.SUCCESS
