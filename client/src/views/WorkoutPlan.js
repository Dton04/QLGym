import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function WorkoutPlan({ token }) {
    const [workoutData, setWorkoutData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/workout-plan', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setWorkoutData(response.data);
            } catch (error) {
                console.error('Error fetching workout plan:', error);
            }
        };

        fetchData();
    }, [token]);

    return (
        <div>
            <Navbar />
            <h1>Your Workout Plan</h1>
            <div>
                {workoutData.length === 0 ? (
                    <p>No workout plan found. Please create one.</p>
                ) : (
                    <ul>
                        {workoutData.map((workout) => (
                            <li key={workout.id}>{workout.name}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default WorkoutPlan;