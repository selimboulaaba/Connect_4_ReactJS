import React, { useEffect, useRef, useState } from 'react'
import InviteToGameModal from './InviteToGameModal';
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '../services/user.service'
import { setUser, signOut, startLoading, updateExperience, updateStats } from '../store/actions/userActions'
import { io } from 'socket.io-client';
import { nextGame, setGame, setRematchPending, clearRematchPending } from '../store/actions/gameActions'
import { toast } from 'react-toastify';
import GameAcceptedModal from './GameAcceptedModal';
import { setSocket } from '../contexts/socketInstance';

function Socket() {

    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();
    const socketRef = useRef(null);

    const [inviteModalOpen, setInviteModalOpen] = useState(false);
    const closeInviteModal = () => setInviteModalOpen(false);
    const [inviteData, setInviteData] = useState(null);

    const [inviteAcceptedModalOpen, setInviteAcceptedModalOpen] = useState(false);
    const closeInviteAcceptedModal = () => setInviteAcceptedModalOpen(false);
    const [inviteAccpetedData, setInviteAccpetedData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            dispatch(startLoading())
            getUser()
                .then(response => {
                    dispatch(setUser(response.data.user));
                })
                .catch(error => {
                    dispatch(signOut())
                });
        }
    }, [user.username]);

    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_URL);
        socketRef.current = socket;
        setSocket(socket);

        socket.on('connect', () => {
            if (user.username) {
                socket.emit('register', user.username);
            }
        });

        socket.on('newMove', (data) => {
            dispatch(setGame(data.newGame))
            if (data.next) {
                dispatch(clearRematchPending())
                dispatch(nextGame())
            }
        });

        socket.on('gameJoined', (data) => {
            dispatch(setGame(data.newGame));
        });

        socket.on('inviteFriend', (data) => {
            getUser()
                .then((res) => dispatch(setUser(res.data.user)))
                .catch(() => {});
            setInviteData(data);
            setInviteModalOpen(true);
        });

        socket.on('rematchRequested', (data) => {
            dispatch(setRematchPending(data.username));
        });

        socket.on('inviteAccepted', (data) => {
            setInviteAccpetedData(data)
            setInviteAcceptedModalOpen(true)
        });

        socket.on('inviteDeclined', (data) => {
            toast.info(data.username + " Declined the Invite.")
        });

        socket.on('updateExperience', (data) => {
            dispatch(updateExperience(data))
        });

        socket.on('updateStats', (data) => {
            dispatch(updateStats(data.stats))
        });

        socket.on('achievementsUnlocked', (data) => {
            data.achievements.forEach(achievement => {
                toast.success(`🎉 Achievement Unlocked: ${achievement.label}!`, {
                    autoClose: 4000,
                })
            })
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
            setSocket(null);
        };
    }, [user.username]);

    return (
        <>
            <InviteToGameModal open={inviteModalOpen} closeModal={closeInviteModal} inviteData={inviteData} socket={socketRef.current} />
            <GameAcceptedModal open={inviteAcceptedModalOpen} closeModal={closeInviteAcceptedModal} inviteData={inviteAccpetedData} />
        </>
    )
}

export default Socket