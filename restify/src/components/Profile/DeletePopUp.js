import { Dialog, DialogContent, DialogActions, DialogTitle, DialogContentText } from "@mui/material"
import { Button } from "@mui/material"

const DeletePopUp = (props) => {

    const {openPopUp, handleClose, deleteAction, title, objectToDelete} = props

    return (
        <Dialog
            open={openPopUp}
            onClose={handleClose}
        >

            <DialogTitle>
                {title}
            </DialogTitle>

            <DialogContent>
                <DialogContentText>
                    Are you sure you want to permanently delete this {objectToDelete}?
                </DialogContentText>
            </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={deleteAction} autoFocus>
                        Delete
                    </Button>
                </DialogActions>

        </Dialog>
    )

}

export default DeletePopUp