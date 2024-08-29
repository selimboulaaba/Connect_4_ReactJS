import React from 'react'
import { useNavigate } from 'react-router-dom'
import Popup from 'reactjs-popup';

function GameAcceptedModal({ open, closeModal, inviteData }) {
    const navigate = useNavigate();

    const accept = () => {
        closeModal();
        navigate('/online/' + inviteData.gameId, { replace: true })
    }

    return (
        <Popup open={open} closeOnDocumentClick onClose={closeModal} modal>
            <div className="modal rounded-lg bg-black p-10 w-[90vw] md:w-[50vw] text-center">
                <div className="header text-2xl md:text-3xl">Game Invitation</div>
                <div className="content text-lg md:text-xl">
                    <span className='text-[#646cff]'>{inviteData?.username}</span> Accepted the Invite.
                </div>
                <div className="actions grid grid-cols-12 gap-3 mt-5">
                    <button className="button text-[#646cff] hover:text-[#535bf2] col-span-6 sm:col-span-5 md:col-span-4" onClick={accept}>
                        Join Game
                    </button>
                    <button className="button text-[#646cff] hover:text-[#535bf2] col-span-6 sm:col-start-8 sm:col-span-5 md:col-start-9 md:col-span-4" onClick={closeModal}>
                        Decline
                    </button>
                </div>
            </div>
        </Popup >
    )
}

export default GameAcceptedModal