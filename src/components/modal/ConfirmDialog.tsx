import React from "react";
import {Modal, ModalHeader, ModalBody, ModalFooter, ModalContent} from '@nextui-org/modal'
import {Button} from '@nextui-org/button'

interface ConfirmDialogProps {
    title: string;
    body?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isOpen: boolean;
    onClose: () => void;
}

export default function ConfirmDialog({
                                          title,
                                          body,
                                          onConfirm,
                                          onCancel,
                                          isOpen,
                                          onClose,
                                      }: ConfirmDialogProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader>
                    {title}
                </ModalHeader>
                {
                    body && <ModalBody>
                        {body}
                    </ModalBody>
                }
                <ModalFooter>
                    <Button color="danger" onClick={onCancel}>
                        Cancelar
                    </Button>
                    <Button onClick={onConfirm}>
                        Confirmar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
