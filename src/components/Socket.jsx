import React, { useEffect, useState } from 'react'
import InviteToGameModal from './InviteToGameModal';
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '../services/user.service'
import { setUser, signOut, startLoading, updateExperience } from '../store/actions/userActions'
import { io } from 'socket.io-client';
import { nextGame, setGame } from '../store/actions/gameActions'
import { toast } from 'react-toastify';
import GameAcceptedModal from './GameAcceptedModal';

function Socket() {

    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();

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

    const socket = io(import.meta.env.VITE_API_URL)
    useEffect(() => {
        socket.on('connect', () => {
            if (user.username) {
                socket.emit('register', user.username);
            }
        });

        socket.on('newMove', (data) => {
            dispatch(setGame(data.newGame))
            if (data.next)
                dispatch(nextGame())
        });

        socket.on('gameJoined', (data) => {
            dispatch(setGame(data.newGame));
        });

        socket.on('inviteFriend', (data) => {
            setInviteData(data);
            setInviteModalOpen(true);
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

        return () => {
            socket.disconnect();
        };
    }, [user.username]);

    return (
        <>
            <InviteToGameModal open={inviteModalOpen} closeModal={closeInviteModal} inviteData={inviteData} />
            <GameAcceptedModal open={inviteAcceptedModalOpen} closeModal={closeInviteAcceptedModal} inviteData={inviteAccpetedData} />
        </>
    )
}

export default Socket