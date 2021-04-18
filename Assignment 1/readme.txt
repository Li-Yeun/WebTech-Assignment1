group id: G07

students:
Li Yuen Xu (6521495)
Mirco Clement (6129196)
Max van Pelt (6936199)

Direct link (full URL) to the location of the website: http://webtech.science.uu.nl/group7/

The create_database.js file, creates the initial database if there's no database.db file available.
The main.js file contains the server code, handles all the GET and POST request.
The assessment.js file contains the client code, displays the quizzes and makes request to the server.


Registered users:
1. username = admin | password = admin 
2. username = guest | password = guest
3. username = Li-Yeun | password = Xu
4. username = Max | password = Pelt 
5. username = Mirco | password = Clement

SQL:
Our database has 4 different tables: Questions, Quizzes, Registered_Users and Topics

De Questions table has the follwing columns: questionID, quizID, title, question, answer, type, MCQ
the type column indicates if the question is a open question (0) or an Multiple Choice question (1).
the type MCQ column contains the possible Multiple Choice question answers.

De Quizzes table has the follwing columns: topicID, quizID, title
It's a helper table, to be able to map the questions,quizzes and topics with each other.

De Registered_Users table has the follwing columns: sessionID, username, password, total_questions, total_correct_answers, session_total_questions, session_correct_answers 

De Topics table has the follwing columns: qtopicID, title, link, quizzes