import React, { useState, useContext, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { createMember, updateMember } from '../services/api';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  width: 80%;
  max-width: 500px;
  margin: auto;

  @media (max-width: 767px) {
    width: 100%;
    max-width: 100%;
    border-radius: 0px;
    margin: 22px;
  }
`;

const ImageUploadContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  margin-bottom: 20px;
  width: 100%;
`;

const ImagePlaceholderContainer = styled.div`
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70px;
  width: 70px;
  background-color: #fff;
  overflow: hidden;
`;

const ImageText = styled.p`
  color: #4d4d4d;
  font-size: 14px;
  font-weight: 400;
  padding: 5px 0px 0px 10px;
`;

const ModalTitle = styled.div`
  color: #000;
  font-size: 22px;
  font-weight: 600;
`;

const ModalHead = styled.div`
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  width: 100%;

  .MuiFormControl-root {
    margin-right: 10px;
    margin-bottom: 10px;
  }
`;

const FormRowHorizontal = styled.div`
  display: flex;
  margin-bottom: 20px;
  width: 100%;

  .MuiFormControl-root {
    margin-right: 10px;
    margin-bottom: 10px;
    flex: 1;
  }
  @media (max-width: 767px) {
    flex-direction: column;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  width: 100%;

  button {
    margin-left: 10px;
    padding: 10px 20px;
  }
`;

// TODO need to add a members index page from where this edit modal will be callled, passing that member.
const AddMemberModal = ({ isVisible, onClose, isEdit = true, memberData }) => {
  const { setDoctors, setPatients } = useContext(AppContext);
  const [avatar, setAvatar] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState('Avatar.svg');
  const { t } = useTranslation();
  console.log(memberData.avatar, 'member');

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setAvatar(file);
    let url = URL.createObjectURL(file);
    setImageUrl(url);
  };

  const calculateAge = (dobString) => {
    const dobDate = new Date(dobString);
    const ageDiffMs = Date.now() - dobDate.getTime();
    const ageDate = new Date(ageDiffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  useEffect(() => {
    if (isEdit && memberData) {
      formik.setValues({
        gender: memberData.gender,
        first_name: memberData.first_name,
        last_name: memberData.last_name,
        role: memberData.role,
        dob: memberData.dob,
      });
      setImageUrl(memberData.avatar);
    }
  }, [isEdit, memberData]);

  const handleOnSubmit = async (values) => {
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('member[avatar]', avatar);
      formData.append('member[first_name]', values.first_name);
      formData.append('member[last_name]', values.last_name);
      formData.append('member[gender]', values.gender);
      formData.append('member[role]', values.role);
      formData.append('member[age]', calculateAge(values.dob));
      let response;
      if (isEdit) {
        response = await updateMember(memberData.id, formData);
      } else {
        response = await createMember(formData);
      }
      if (response.member.role === 'patient') {
        setPatients((old) => [...old, response.member]);
      } else {
        setDoctors((old) => [...old, response.member]);
      }
      onClose();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
      onClose();
    }
  };

  const formik = useFormik({
    initialValues: {
      gender: '',
      first_name: '',
      last_name: '',
      role: '',
      avatar: '',
      dob: '',
    },
    validationSchema: Yup.object({
      gender: Yup.string().required([t('Gender'), t('is required')].join(' ')),
      first_name: Yup.string().required(
        [t('First Name'), t('is required')].join(' '),
      ),
      last_name: Yup.string().required(
        [t('Last Name'), t('is required')].join(' '),
      ),
      role: Yup.string().required([t('Role'), t('is required')].join(' ')),
      dob: Yup.date().required(
        [t('Date of Birth'), t('is required')].join(' '),
      ),
    }),
    onSubmit: async (values) => {
      handleOnSubmit(values);
    },
  });

  return (
    <Modal
      open={isVisible}
      onClose={onClose}
      aria-labelledby="add-member-modal-title"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      ariaHideApp={false}
    >
      <Container>
        <ModalHead>
          <ModalTitle id="add-member-modal-title">
            {isEdit
              ? [t('Edit'), t('Member')].join(' ')
              : [t('Add'), t('Member')].join(' ')}
          </ModalTitle>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </ModalHead>
        <form
          onSubmit={formik.handleSubmit}
          style={{
            width: '100%',
          }}
        >
          <ImageUploadContainer>
            <label
              htmlFor="avatar-input"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
              <ImagePlaceholderContainer>
                <img src={imageUrl} alt="Person" />
              </ImagePlaceholderContainer>
              <ImageText>{t('Click to upload image')}</ImageText>
            </label>
          </ImageUploadContainer>
          <FormRow>
            <TextField
              id="first-name"
              label={t('First Name')}
              variant="outlined"
              name="first_name"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              value={formik.values.first_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.first_name && Boolean(formik.errors.first_name)
              }
              helperText={formik.touched.first_name && formik.errors.first_name}
            />
          </FormRow>
          <FormRow>
            <TextField
              id="last-name"
              label={t('Last Name')}
              variant="outlined"
              name="last_name"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              value={formik.values.last_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.last_name && Boolean(formik.errors.last_name)
              }
              helperText={formik.touched.last_name && formik.errors.last_name}
            />
          </FormRow>
          <FormRow>
            <TextField
              id="role"
              select
              label={t('Role')}
              variant="outlined"
              name="role"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.role && Boolean(formik.errors.role)}
              helperText={formik.touched.role && formik.errors.role}
            >
              <MenuItem value="doctor">{t('Doctor')}</MenuItem>
              <MenuItem value="patient">{t('Patient')}</MenuItem>
            </TextField>
          </FormRow>
          <FormRowHorizontal>
            <TextField
              id="gender"
              select
              label={t('Gender')}
              variant="outlined"
              name="gender"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.gender && Boolean(formik.errors.gender)}
              helperText={formik.touched.gender && formik.errors.gender}
            >
              <MenuItem value="male">{t('Male')}</MenuItem>
              <MenuItem value="female">{t('Female')}</MenuItem>
            </TextField>
            <TextField
              id="dob"
              label={t('Date of Birth')}
              type="date"
              variant="outlined"
              name="dob"
              InputProps={{
                inputProps: {
                  max: new Date(
                    new Date().setFullYear(new Date().getFullYear() - 1),
                  )
                    .toISOString()
                    .split('T')[0],
                },
              }}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              value={formik.values.dob}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.dob && Boolean(formik.errors.dob)}
              helperText={formik.touched.dob && formik.errors.dob}
            />
          </FormRowHorizontal>
          <ModalFooter>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={submitting}
              disableElevation
              sx={{
                borderRadius: '16px',
                border: '1px solid var(--White, #FFF)',
                background: 'var(--Main-Blue, #2196F3)',
                color: 'white',
                '&.Mui-disabled': {
                  background: 'lightgrey',
                },
              }}
            >
              {t('Save')}
            </Button>
          </ModalFooter>
        </form>
      </Container>
    </Modal>
  );
};

export default AddMemberModal;
