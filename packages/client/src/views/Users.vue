<template>
  <section class="container-fluid">
    <b-row>
      <b-col>
        <h2>Users</h2>
      </b-col>
      <b-col></b-col>
      <b-col class="d-flex justify-content-end">
        <div>
          <b-button variant="success" @click="openUploadUsersModal" class="mr-1">Bulk Import</b-button>
        </div>
        <div>
          <b-button variant="success" @click="openAddUserModal" class="mr-1">Add</b-button>
        </div>
      </b-col>
    </b-row>
    <b-table hover :items="formattedUsers" :fields="fields">
      <template #cell(actions)="row">
        <div v-if="row.item.email !== loggedInUser.email">
          <b-button v-if="userRole === 'admin'" variant="danger" class="mr-1" size="sm"
            @click="deleteUser(row.item.id)">
            <b-icon icon="trash-fill" aria-hidden="true"></b-icon>
          </b-button>
        </div>
      </template>
    </b-table>
    <AddUserModal :showModal.sync="showAddUserModal" />
    <ImportUsersModal :showUploadModal.sync="showUploadUsersModal" :importStatus="'Nothing imported yet.'"/>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import AddUserModal from '@/components/Modals/AddUser.vue';
import ImportUsersModal from '@/components/Modals/ImportUsers.vue';

export default {
  components: {
    AddUserModal,
    ImportUsersModal,
  },
  data() {
    return {
      fields: [
        {
          key: 'email',
          sortable: true,
        },
        {
          key: 'name',
        },
        {
          key: 'role',
          sortable: true,
        },
        {
          key: 'agency_name',
          sortable: true,
        },
        {
          key: 'agency_abbrv',
          sortable: true,
        },
        {
          key: 'created_at',
        },
        { key: 'actions', label: 'Actions' },
      ],
      showAddUserModal: false,
      showUploadUsersModal: false,
    };
  },
  mounted() {
    this.fetchUsers();
  },
  computed: {
    ...mapGetters({
      loggedInUser: 'users/loggedInUser',
      users: 'users/users',
      userRole: 'users/userRole',
      selectedAgency: 'users/selectedAgency',
    }),
    formattedUsers() {
      return this.users.map((user) => ({
        ...user,
        agency_name: user.agency.name,
        agency_abbrv: user.agency.abbreviation,
        role: user.role.name,
      }));
    },
  },
  watch: {
    selectedAgency() {
      this.setup();
    },
  },
  methods: {
    ...mapActions({
      fetchUsers: 'users/fetchUsers',
      deleteUser: 'users/deleteUser',
    }),
    setup() {
      this.fetchUsers();
    },
    openAddUserModal() {
      this.showAddUserModal = true;
    },
    openUploadUsersModal() {
      this.showUploadUsersModal = true;
    },
  },
};
</script>
