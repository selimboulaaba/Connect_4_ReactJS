import React from 'react'
import { useNavigate } from 'react-router-dom'
import Popup from 'reactjs-popup';
import { useDispatch } from 'react-redux'
import { setUser } from '../store/actions/userActions'
import { getUser } from '../services/user.service'

function InviteToGameModal({ open, closeModal, inviteData, socket }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const refreshUser = () => {
        getUser().then((r) => dispatch(setUser(r.data.user))).catch(() => {});
    };

    const accept = () => {
        closeModal();
        if (socket) socket.emit('acceptInvite', inviteData);
        refreshUser();
        navigate('/online/' + inviteData.newGame._id)
    }

    const decline = () => {
        closeModal();
        if (socket) socket.emit('declineInvite', inviteData);
        refreshUser();
    }
    return (
        <Popup open={open} closeOnDocumentClick onClose={closeModal} modal>
            <div className="modal rounded-lg bg-black p-10 w-[90vw] md:w-[50vw] text-center">
                <div className="header text-2xl md:text-3xl">Game Invitation</div>
                <div className="content text-lg md:text-xl">
                    You've been invited to a game by <span className='text-[#646cff]'>{inviteData?.username}</span>.
                </div>
                <div className="actions grid grid-cols-12 gap-3 mt-5">
                    <button className="button text-[#646cff] hover:text-[#535bf2] col-span-6 sm:col-span-5 md:col-span-4" onClick={accept}>
                        Accept
                    </button>
                    <button className="button text-[#646cff] hover:text-[#535bf2] col-span-6 sm:col-start-8 sm:col-span-5 md:col-start-9 md:col-span-4" onClick={decline}>
                        Decline
                    </button>
                </div>
            </div>
        </Popup>
    )
}

export default InviteToGameModal
