import axios from "axios";
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';

export default function ProductsDemo() {
    //Objet pour initialiser le state produits
    let emptyAdmin = {
        id : '',
        nom : '',
        prenoms :'',
        sexe : '',
        date :'',
        password : '',
        repassword : '',
        username : '',
        contact : ''
    };
    

    const [admins, setAdmins] = useState(null);
    const [adminDialog, setAdminDialog] = useState(false);
    const [deleteAdminDialog, setDeleteAdminDialog] = useState(false);
    const [deleteAdminsDialog, setDeleteAdminsDialog] = useState(false);
    const [admin, setAdmin] = useState(emptyAdmin);
    const [selectedAdmins, setSelectedAdmins] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    

    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/listadmin')
        .then(res => {
            const __admin = res['data'];
            setAdmins(res['data']);
            console.log(__admin);
        })
        .catch(error => console.log(error));
    }, []);


    //Pour le bouton Ajouter
    const openNew = () => {
        setAdmin(emptyAdmin);
        setSubmitted(false);
        setAdminDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setAdminDialog(false);
    };

    const hideDeleteAdminDialog = () => {
        setDeleteAdminDialog(false);
    };

    const hideDeleteAdminsDialog = () => {
        setDeleteAdminsDialog(false);
    };


    //Ajout et la modification des administrateur
    const saveAdmin = () => {
        setSubmitted(true);

        if (admin.nom.trim()) {
            let _admins = [...admins];
            let _admin = {...admin};
            console.log(_admin);
            console.log(_admin);
            console.log(_admins);
            //La modification
            if (admin.id) {
                //requete de mise a jour des données
                axios.put('http://localhost:8080/api/v1/updateadmin',_admin )
                .then(res => {
                    //requete de rechargement de la liste des admins
                    axios.get('http://localhost:8080/api/v1/listadmin')
                    .then(res => {
                        setAdmins(res['data']);
                      console.log(res['data']);
                    })
                    .catch(error => console.log(error));
                    console.log(res);
                })
                .catch(error => console.log(error.response.data.Erreur));
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Modification effectué', life: 3000 });
            } else {
                axios.post('http://localhost:8080/api/v1/addadmin',_admin )
                .then(res => {
                    //requete de rechargement de la liste des admins
                    axios.get('http://localhost:8080/api/v1/listadmin')
                    .then(res => {
                        setAdmins(res['data']);
                      console.log(res['data']);
                    })
                    .catch(error => console.log(error));
                    console.log(res);
                })
                .catch(error => {
                    console.log(error.response.data.Erreur)
                    Swal.fire({
                        title: "Erreur",
                        text: error.response.data.Erreur,
                        icon: "error"
                      });
                    });
            }

            setAdmins(_admins);
            setAdminDialog(false);
            setAdmin(emptyAdmin);
        }
    };

    const editadmin = (admin) => {
        const dateParts = admin.date_naiss.split("/");
        const date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
        console.log(admin);
        setAdmin({
            id : admin.id,
            nom : admin.nom,
            prenoms : admin.prenoms,
            sexe : admin.sexe,
            date : date,
            password : admin.pwd,
            repassword : admin.pwd,
            username : admin.username,
            contact : admin.contact
        });
        setAdminDialog(true);
    };

    const confirmDeleteAdmin = (admin) => {
        setAdmin(admin);
        Swal.fire({
            title: "Etes vous sûre?",
            text: "Cette action est irreversible!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Oui, je supprime",
            cancelButtonText: "Annuller"
          }).then((result) => {
            if (result.isConfirmed) {
                let _admins = {id : ""+admin.idAdmin+""};
                console.log(_admins);
        
                axios.post('http://localhost:8080/api/v1/deleteadmin', _admins)
                .then(res => {
                    //requete de rechargement de la liste des admins
                    axios.get('http://localhost:8080/api/v1/listadmin')
                    .then(res => {
                        setAdmins(res['data']);
                      console.log(res['data']);
                    })
                    .catch(error => console.log(error));
                    console.log(res);
                })
                .catch(error => console.log(error));
                setDeleteAdminDialog(false);
                setAdmin(emptyAdmin);
              Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
              });
            }
          });
    };

    const deleteAdmin = () => {
        //Suppression d'un produit specifique
        console.log(admin);

        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'admin Deleted', life: 3000 });
    };


    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteAdminsDialog(true);
    };

    const deleteSelectedAdmins = () => {
        //Requete de suppression des produit
        
        const selectlength = selectedAdmins.length ; 
        for (let i = 0; i < selectlength; i++ ){
            console.log(selectedAdmins[i]);
            const _idadmin = {id : selectedAdmins[i].idAdmin};
            console.log(_idadmin);
            axios.post("http://localhost:8080/api/v1/deleteadmin", _idadmin)
            .then(res =>{
                //requete de rechargement de la liste des admins
                axios.get('http://localhost:8080/api/v1/listadmin')
                .then(res => {
                    setAdmins(res['data']);
                  console.log(res['data']);
                })
                .catch(error => console.log(error));
                console.log(res['data']);
            })
            .catch(error =>{
                console.log(error);
            })
        }
        
        let _admins = admins.filter((val) => !selectedAdmins.includes(val));

        setAdmins(_admins);
        setDeleteAdminsDialog(false);
        setSelectedAdmins(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'admins Deleted', life: 3000 });
    };

    const onCategoryChange = (e) => {
        let _admin = { ...admin };
        _admin['sexe'] = e.value;
        setAdmin(_admin);
    };
    
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _admin = { ...admin };

        _admin[`${name}`] = val;
        console.log(_admin);
        setAdmin(_admin);
    };


    const onDateChange = (e) => {
        let _admin = { ...admin };
        console.log(_admin);
        _admin['date'] =e.value ;
        console.log(_admin);
        setAdmin(_admin);
    };


    //Gestion des bouton d'ajout et de suppression
    const leftToolbarTemplate = () => {
        
        const level = parseInt(localStorage.getItem('userLevel'));
        if (level === 1) {
            return(
                <div className="flex flex-wrap gap-2">
                    <Button label="Ajouter" icon="pi pi-plus" severity="success" onClick={openNew} />
                    <Button label="Supprimer" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedAdmins || !selectedAdmins.length} />
                </div>

            )
        }
        else{
            return(
                null
            )
        }
    };

    //Gestion de l'export 
    const rightToolbarTemplate = () => {
        return <Button label="Exporter" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    //Bouton de la dernière colonne de chaque ligne du tableau
    const actionBodyTemplate = (rowData) => {
        const level = parseInt(localStorage.getItem('userLevel'));
        console.log(level);
        if (level === 1) {
            return (
                <React.Fragment>
                    <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editadmin(rowData)} />
                    <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteAdmin(rowData)} />
                </React.Fragment>
            );
        } else {
            return null; // Rien ne sera affiché si rowData.userLevel !== 1
        }
    };

    const selectedMultiple = () => {
        const level = parseInt(localStorage.getItem('userLevel'));
        if(level === 1) {
            return "multiple"
        }else {
            return "Single"
        }
    };


    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Liste des Administrateurs</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Rechercher..." />
            </span>
        </div>
    );
    const adminDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveAdmin} />
        </React.Fragment>
    );
    const deleteAdminDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteAdminDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteAdmin} />
        </React.Fragment>
    );
    const deleteAdminsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteAdminsDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedAdmins} />
        </React.Fragment>
    );

    return (
        <div>
            {/*Tableau complet */}
            <Toast ref={toast} />
            <div className="card">
                {/*Entete du Tableau */}
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                {/*Datatable*/}
                <DataTable ref={dt} value={admins} selection={selectedAdmins} onSelectionChange={(e) => setSelectedAdmins(e.value)}
                        dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Afficher de  {first} à {last} sur {totalRecords} administrateurs" globalFilter={globalFilter} header={header}>
                    <Column selectionMode={selectedMultiple()} exportable={false}></Column>
                    <Column field="nom" header="Nom" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="prenoms" header="Prenoms" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="username" header="Nom d'utilisateur" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="date_naiss" header="Date de naissance" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="sexe" header="Sexe" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="contact" header="Contact" sortable style={{ minWidth: '8rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            {/*Popup d'ajout d'une ligne */}
            <Dialog visible={adminDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Detail Administrateur" modal className="p-fluid" footer={adminDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="nom" className="font-bold">
                        Nom
                    </label>
                    <InputText id="nom" value={admin.nom} onChange={(e) => onInputChange(e, 'nom')} required autoFocus className={classNames({ 'p-invalid': submitted && !admin.nom })} />
                    {submitted && !admin.nom && <small className="p-error">Le nom est obligatoire.</small>}
                </div>
                <div className="field">
                    <label htmlFor="prenoms" className="font-bold">
                        Prenoms
                    </label>
                    <InputText id="prenoms" value={admin.prenoms} onChange={(e) => onInputChange(e, 'prenoms')} required autoFocus className={classNames({ 'p-invalid': submitted && !admin.prenoms })} />
                    {submitted && !admin.prenoms && <small className="p-error">Le nom est obligatoire.</small>}
                </div>

                <div className="field">
                    <label className="mb-3 font-bold">Sexe</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="f" name="sexe" value="F" onChange={onCategoryChange} checked={admin.sexe === 'F'} />
                            <label htmlFor="f">Feminin</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="m" name="sexe" value="M" onChange={onCategoryChange} checked={admin.sexe === 'M'} />
                            <label htmlFor="m">Masculin</label>
                        </div>
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="date" className="font-bold">
                        Date de naissance
                    </label>
                    <Calendar  id="date" value={admin.date} onChange={onDateChange} required  className={classNames({ 'p-invalid': submitted && !admin.date })} dateFormat="dd/mm/yy" />
                    {submitted && !admin.date && <small className="p-error">La date de naissance est obligatoire.</small>}
                </div>

                
                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="username" className="font-bold">
                            Nom d'utilisateur
                        </label>
                        <InputText id="username" value={admin.username} onChange={(e) => onInputChange(e, 'username')} required autoFocus className={classNames({ 'p-invalid': submitted && !admin.username })} />
                        {submitted && !admin.username && <small className="p-error">Le nom d'utilisateur est obligatoire.</small>} 
                    </div>
                    <div className="field col">
                        <label htmlFor="contact" className="font-bold">
                            Contact
                        </label>
                        <InputText id="contact" value={admin.contact} onChange={(e) => onInputChange(e, 'contact')} required autoFocus className={classNames({ 'p-invalid': submitted && !admin.contact })} />
                        {submitted && !admin.contact && <small className="p-error">Le contact est obligatoire</small>}
                    </div>
                </div>

                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="username" className="font-bold">
                            Mot de passe
                        </label>
                        <Password  id="password" value={admin.password} onChange={(e) => onInputChange(e, 'password')} required autoFocus className={classNames({ 'p-invalid': submitted && !admin.password })} feedback={false} toggleMask  />
                        {submitted && !admin.password && <small className="p-error">Le mot de passe est obligatoire.</small>} 
                    </div>
                    <div className="field col">
                        <label htmlFor="contact" className="font-bold">
                            Confirmation mot de passe
                        </label>
                        <Password  id="contact" value={admin.repassword} onChange={(e) => onInputChange(e, 'repassword')} required autoFocus className={classNames({ 'p-invalid': submitted && !admin.repassword })} feedback={false}  toggleMask />
                        {submitted && !admin.repassword && <small className="p-error">Confirmer le mot de passe</small>}
                    </div>
                </div>
                
            </Dialog>


            {/*Popup de confirmation de suppression d'une ligne */}
            <Dialog visible={deleteAdminDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteAdminDialogFooter} onHide={hideDeleteAdminDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {admin && (
                        <span>
                            Etre vous sure de vouloir supprimer  <b>{admin.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            {/*Popup de confirmation de suppression des produits selectionnés */}
            <Dialog visible={deleteAdminsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteAdminsDialogFooter} onHide={hideDeleteAdminsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {admin && <span>Etre vous sure de vouloir supprimer les produits selectionnés?</span>}
                </div>
            </Dialog>
        </div>
    );
}
        