from flask_restful import Resource
from Base.Connector import MongoConnector
from Base.ResponseCode import ResponseCode
from flask import request


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
        return member , ResponseCode.SUCCESS if member else ResponseCode.MEMBER_NOT_EXIST
    
    def post(self):
        '''
        Sign up for a membership.
        Data json: account, password, email
        '''
        data = request.get_json()
        account = data['account']
        password = data['password']
        email = data['email']
        if self._membershipConnection.find_one({'email': email}):
            return ResponseCode.MEMBER_ALREADY_EXIST
        
        member = {
            'account': account,
            'password': password,
            'email': email,
        }
        self._membershipConnection.insert_one(member)
        return ResponseCode.SUCCESS if self._membershipConnection.find_one({'email': email}) else ResponseCode.BAD_REQUEST

    def put(self):
        '''
        Update a membership.
        Data json: account, password, email
        '''
        data = request.get_json()
        account = data['account']
        password = data['password']
        email = data['email']
        if not self._membershipConnection.find_one({'email': email}):
            return ResponseCode.MEMBER_NOT_EXIST
        
        member = {
            'account': account,
            'password': password,
            'email': email,
        }
        self._membershipConnection.update_one({'email': email}, {'$set': member})
        return ResponseCode.SUCCESS
