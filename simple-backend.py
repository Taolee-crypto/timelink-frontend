from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/test')
def api_test():
    return jsonify({
        'success': True,
        'message': '백엔드 서버 작동 중',
        'timestamp': '2024-12-06T04:00:00Z'
    })

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    if data.get('email') == 'integration@test.com' and data.get('password') == 'test123':
        return jsonify({
            'success': True,
            'token': 'test-token',
            'user': {'id': 1, 'email': data['email'], 'username': 'testuser'}
        })
    return jsonify({'success': False, 'error': '로그인 실패'}), 401

if __name__ == '__main__':
    print('백엔드 서버 시작: http://localhost:8787')
    app.run(port=8787, debug=True)
