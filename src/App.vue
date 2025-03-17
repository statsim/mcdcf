<style scoped>
/* nav apply greyscale filter */
/* .v-main, .v-navigation-drawer { */
  /* background-color: #f2f4f6 !important; */
/* } */
body {
  font-family: monospace;
}
.v-application :deep(.v-application__wrap) {
    min-height: fit-content !important;
}
.v-container {
  max-width: 1200px !important;
}
.v-data-table { 
  /* overflow-x: auto; */
  overflow-x: auto !important;
}
.v-expansion-panel-title {
  font-weight: 800;
  font-size: 24px !important;
  /* text-decoration: underline; */
}
.v-list-item {
  border:none;
}
.v-list-item-title {
  font-size: 14px !important;
}
.v-card {
  border-radius: 0 !important;
}
#logo {
  padding: 14px 2px;
  /* text-align: center; */
}
#logo span {
  font-size: 18px !important;
  font-weight: 800;
  color: #000;
  margin-right: 17px;
  padding-bottom: 0px;
  position: relative;
  /* text-decoration: underline; */
  /* border-bottom: 3px solid #000; */
  /* add animation transition */
  transition: all 0.4s ease-in-out;
}
#logo span::after {
  content: "";
  position: absolute;
  left: 1px;
  bottom: -1px; /* Adjust this value to control spacing */
  width: 3px;
  height: 3px;
  background-color: #000;
}
#logo p {
  font-size: 9px;
  color: #000;
  margin-top: 3px;
  /* text-align: right; */
}
#property-title {
  position: relative;
  font-size: 38px;
  font-weight: 900;
}

#property-title::after {
  content: "";
  position: absolute;
  left: 1px;
  bottom: -1px; /* Adjust this value to control spacing */
  width: 5px;
  height: 5px;
  background-color: #000;
}

.caption {
  font-size: 12px;
  color: #888;
  margin-bottom: 10px;
}
.red-bg {
  background-color: red;
}


@media print {
  /* Hide elements with class no-print */
  .v-main {
    padding: 20px !important;
  }
  .no-print {
    display: none !important;
  }
  
  /* Optionally, only show elements with class print-only */
  .print-only {
    display: block !important;
  }
}
</style>

<template>
  <v-app :full-height="false">
      <v-snackbar v-model="showAlert" bottom>
          Link copied to clipboard...
        <template #actions>
          <v-btn text @click="showAlert = false">Close</v-btn>
        </template>
      </v-snackbar>
    <v-app-bar color="white" app v-if="$vuetify.display.mdAndDown" style="padding-left: 10px; padding-right: 10px;">
      <!-- <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon> -->
      <v-btn icon="$mdi-menu" @click.stop="drawer = !drawer"></v-btn>
      
      <v-toolbar-title></v-toolbar-title>
      
      <v-spacer></v-spacer>

      <v-btn @click="run()" color="black" variant="flat" dark prepend-icon="$mdi-lightning-bolt" rounded="0">RUN MODEL</v-btn>
      <!-- <v-btn icon="mdi-dots-vertical" variant="text"></v-btn> -->
    </v-app-bar>
    <v-navigation-drawer :width="220" v-model="drawer" class="no-print">
      <v-list-item>
        <div id="logo">
          <span id="logo-1">M</span>
          <span id="logo-2">C</span>
          <span id="logo-3">D</span>
          <span id="logo-4">C</span>
          <span id="logo-5">F <sup style="font-size: 10px; color: grey; font-weight: 100;">{{ version }}</sup></span>
          <!-- <p>Monte Carlo Discounted Cash Flow</p> -->
        </div>
      </v-list-item>
      <!-- <v-divider></v-divider> -->
      <v-list-item title="Model" link @click="goToPanel(0)" class="nav">
        <!-- <template v-slot:prepend>
          <v-icon
            color="#1832c0"
            size="small"
          >mdi-cog</v-icon>
        </template> -->
      </v-list-item>
      <v-list-item link title="Property" @click="goToPanel(1)" class="nav">
        <!-- <template v-slot:prepend>
          <v-icon
            color="#3e86ff"
            size="small"
          >mdi-home</v-icon>
        </template> -->
      </v-list-item>
      <v-list-item link title="Income" @click="goToPanel(2)" class="nav">
        <!-- <template v-slot:prepend>
          <v-icon
            color="#aee26f"
            size="small"
          >mdi-arrow-top-right</v-icon>
        </template> -->
      </v-list-item>
      <v-list-item link title="Expenses" @click="goToPanel(3)" class="nav">
        <!-- <template v-slot:prepend>
          <v-icon
            color="#ffcc04"
            size="small"
          >mdi-arrow-bottom-right</v-icon>
        </template> -->
      </v-list-item>
      <v-list-item link title="Taxes" @click="goToPanel(4)" class="nav"></v-list-item>
      <v-list-item link title="Import/Export" @click="goToPanel(5)" class="nav"></v-list-item>
      <v-list-item link title="Results" @click="goToPanel(6)" class="nav">
        <v-card variant="text" style="margin-top: 12px; padding: 10px 0px;" v-if="!first_run">
            <h5><span style="background: black; color: white; padding: 1px 5px;"> NPV</span> {{ results.npv }} <sup style="color: #888; font-size: 10px; font-weight: 100;"> ±{{ results.npv_std }} </sup></h5>
            <h5><span style="background: black; color: white; padding: 1px 5px;"> IRR</span> {{ results.irr }}% <sup style="color: #888; font-size: 10px; font-weight: 100;"> ±{{ results.irr_std }} </sup></h5>
        </v-card>
      </v-list-item>

      <!-- <v-divider></v-divider> 
                <v-overlay
            activator="parent"
            location-strategy="connected"
            ll-strategy="block"
            scroll-strategy="close"
          >
            <v-card class="pa-2" style="max-width: 300px; line-height: 1.2">
              <p>Copied to clipboard</p>
              <small style="color: #888; font-size: 12px">
                This link contains your entire project data compressed directly in the URL — no server storage needed. When opened, the app automatically extracts and loads all your settings from the URL itself.
              </small>
            </v-card>
          </v-overlay> 
      -->
      <v-list-item style="padding-top: 18px;">
        <v-btn 
          @click="copyLinkToClipboard" 
          variant="outlined"
          color="black" 
          dark
          prepend-icon="$mdi-link"
          rounded="0"
          :width="190"
        >
          Copy Link
        </v-btn>
      </v-list-item>
      <v-list-item style="padding-top: 18px;">
        <!-- <v-container> -->
          <!-- <v-btn @click="run()" color="black" dark prepend-icon="mdi-play-circle">RUN MODEL</v-btn> -->
          <!-- <v-btn @click="run()" variant="outlined" color="black" dark v-bind:prepend-icon="mdiLightningBolt" rounded="0">RUN MODEL</v-btn> -->
          <v-btn
            v-if="$vuetify.display.lgAndUp"
            @click="run()"
            variant="flat"
            color="black"
            dark
            prepend-icon="$mdi-lightning-bolt"
            rounded="0"
            :width="190"
          >RUN MODEL</v-btn>
        <!-- </v-container> -->
      </v-list-item>
      <v-list-item>
        <!-- autorun switch -->
        <v-switch
          v-model="project.autorun"
          label="Auto-run"
          hide-details
        ></v-switch>
        <!-- <p>Interval: {{ interval }}</p> -->
        <!-- <p>Samples: {{ samples }}</p> -->
        <!-- <p>Months</p> -->
      </v-list-item> 
      <!-- <v-divider></v-divider> -->
      <v-list-item title="Example 1.1" link @click="load_example('1_1')" v-if="first_run"></v-list-item>
      <v-list-item title="Example 1.2" link @click="load_example('1_2')" v-if="first_run"></v-list-item>
      <v-list-item title="Example 2" link @click="load_example('2')" v-if="first_run"></v-list-item>
      <v-list-item title="Example 3" link @click="load_example('3')" v-if="first_run"></v-list-item>
      <!-- <v-divider></v-divider> -->
      <!-- <pre style="font-size:8px"> {{ project }} </pre> -->
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <!-- <v-expansion-panels multiple variant="accordion" v-model="active_panels" elevation="0"> -->
        <v-expansion-panels
          multiple
          variant="accordion"
          v-model="active_panels"
          elevation="0"
          style="border: 1px solid #e0e0e0"
          rounded="0"
          class="no-print"
        >
          <v-expansion-panel id="panel_0">
          <!-- <v-expansion-panel id="panel_0" style="border-left: 3px solid #1832c0"> -->
            <v-expansion-panel-title>
              Model
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <!-- Three blocks for economic Growth, inflation, discount rate-->
                <v-row>
                  <v-col cols="12" md="3">
                    <v-select
                      v-model="project.model.interval"
                      :items="intervals_global"
                      label="Global step size (interval)"
                    ></v-select>
                    <p class="caption">
                        Defines how large each simulation step is. For example, if the step size is <b>Month</b>, each simulation step will be one month long. Possible values are Month, Quarter, Year.
                    </p>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field :label="`Number of steps (${project.model.interval.toLowerCase()}s)`" v-model.number="project.model.steps" type="number" min="1"></v-text-field>
                    <p class="caption">
                        The number of steps is the number of times the model is run. For example, if the number of steps is set to 12 and the interval is <b>Month</b>, the model will be run for 12 months.
                    </p>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field label="Number of samples" v-model.number="project.model.samples" type="number" min="1"></v-text-field>
                    <p class="caption">
                        The number of samples is the number of times the simulation is run. This is used to calculate the distribution of the results in Monte Carlo simulations.
                    </p>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field label="Precision" v-model.number="project.model.precision" type="number"></v-text-field>
                    <p class="caption">
                      The precision is the number of decimal places used in the simulation. Increasing the precision will increase the accuracy of the results.
                    </p>
                  </v-col>
                </v-row>
                <v-row>
                  <!--  -->
                  <v-col cols="12" md="4">
                    <v-card>
                      <template v-slot:title>
                        Inflation
                      </template>
                      <template v-slot:subtitle>
                        Rate of inflation
                      </template>
                      <!-- right top icon -->
                      <template v-slot:append>
                        <v-switch v-model="project.model.inflation.active" label="" hide-details></v-switch>
                      </template>
                      <template v-slot:text v-if="project.model.inflation.active">
                        <v-select
                          v-model="project.model.inflation.type"
                          :items="['Fixed', 'Sample', 'Sample Once', 'Random Walk', 'Tabular']"
                          label="Inflation type"
                        ></v-select>
                        <div v-if="project.model.inflation.type === 'Fixed'">
                          <v-text-field
                            label="Fixed inflation"
                            v-model.number="project.model.inflation.initial"
                            suffix="%"
                          ></v-text-field>
                          <v-select
                            v-model="project.model.inflation.interval"
                            :items="intervals_global"
                            label="Interval"
                          ></v-select>
                        </div>
                        <div v-else-if="project.model.inflation.type.includes('Sample')">
                          <v-row>
                            <v-col cols="12" sm="4">
                              <v-text-field
                                label="Mean"
                                v-model.number="project.model.inflation.mean"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                              <v-text-field
                                label="Std"
                                v-model.number="project.model.inflation.std"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                              <v-text-field
                                label="Df"
                                v-model.number="project.model.inflation.df"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-select
                            v-model="project.model.inflation.interval"
                            :items="intervals_global"
                            label="Interval"
                          ></v-select>
                        </div>
                        <div v-else-if="project.model.inflation.type === 'Random Walk'">
                          <v-text-field
                            label="Initial"
                            v-model.number="project.model.inflation.initial"
                            suffix="%"
                          ></v-text-field>
                          <v-row>
                            <v-col cols="12" sm="4">
                              <v-text-field
                                label="Mean"
                                v-model.number="project.model.inflation.mean"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                              <v-text-field
                                label="Std"
                                v-model.number="project.model.inflation.std"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                              <v-text-field
                                label="Df"
                                v-model.number="project.model.inflation.df"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-select
                            v-model="project.model.inflation.interval"
                            :items="intervals_global"
                            label="Interval"
                          ></v-select>
                        </div>
                        <div v-else-if="project.model.inflation.type === 'Tabular'">
                          <v-row
                            v-for="(step, index) in parseInt(project.model.steps) - 1"
                            :key="index"
                            style="margin-top: 0"
                          >
                            <v-col cols="12" style="margin-top: 0; padding-top: 0; margin-bottom: 0; padding-bottom: 0">
                              <v-text-field
                                :label="'Inflation (' + project.model.interval + ': ' + (index + 1) + ')'"
                                v-model.number="project.model.inflation.growth_values[index]"
                                suffix="%"
                                type="number"
                              >
                                <template v-slot:append>
                                  <v-btn
                                    icon="$mdi-arrow-down-right"
                                    size="x-small"
                                    variant="text"
                                    @click="fill_growth_tabular(
                                      project.model.inflation.growth_values[index],
                                      project.model.inflation.growth_values, 
                                      index
                                    )"
                                  ></v-btn>
                                </template>
                              </v-text-field>
                            </v-col>
                          </v-row>
                        </div>
                        <p class="caption"> 
                          Inflation can be used as a common growth factor for income and expenses values. Interval can be smaller than the global interval. In this case values will be aggregated.
                        </p>
                        <p v-for="i in project.income.items">Used in: <b>{{i.description}} </b> (↗ Income)</p>
                        <p v-for="i in project.expenses.items">Used in: <b>{{i.description}} </b> (↘ Expenses)</p>
                            <!-- v-if="i.amount_growth.type === 'Inflation'" -->
                          <!-- <li v-for="i in project.expenses.items" v-if="i.amount_growth.type === 'Inflation'">Used in: {{ i.description }}</li> -->
                        <!-- 
                        <v-text-field label="Initial value" v-model="project.model.inflation.initial" suffix="%"></v-text-field>
                        <v-text-field label="Increment (mean)" v-model="project.model.inflation.mean"  suffix="%"></v-text-field>
                        <v-text-field label="Increment (std)" v-model="project.model.inflation.std"></v-text-field>
                        <v-text-field label="Increment (degrees of freedom)" v-model="project.model.inflation.df"></v-text-field>
                        <v-select
                          label="Interval"
                          v-model="project.model.inflation.interval"
                          :items="intervals_global"
                          ></v-select>
                          <p class="caption" v-if="!intervals.includes(project.model.inflation.interval)" style="color: red">
                            The inflation update interval must be the same or larger than the global interval: <b>{{ project.model.interval }}</b>
                          </p>
                        -->
                        <!-- :bg-color="intervals.includes(project.model.inflation.interval)  ? null : 'red'" -->
                      </template>
                    </v-card>
                  </v-col>
                  <!--  -->
                  <v-col cols="12" md="4">
                    <v-card>
                      <template v-slot:title>
                        Economic Growth
                      </template>
                      <template v-slot:subtitle>
                        Growth rate of the economy
                      </template>
                      <template v-slot:append>
                        <v-switch v-model="project.model.economic_growth.active" label="" hide-details></v-switch>
                      </template>
                      <template v-slot:text v-if="project.model.economic_growth.active">
                        <!-- Type selection -->
                        <v-select
                          v-model="project.model.economic_growth.type"
                          :items="['Fixed', 'Sample', 'Sample Once', 'Random Walk', 'Tabular']"
                          label="Growth type"
                        ></v-select>
                        <!-- Fixed growth -->
                        <div v-if="project.model.economic_growth.type === 'Fixed'">
                          <v-text-field
                            label="Fixed growth"
                            v-model="project.model.economic_growth.initial"
                            suffix="%"
                          ></v-text-field>
                          <v-select
                            v-model="project.model.economic_growth.interval"
                            :items="intervals_global"
                            label="Interval"
                          ></v-select>
                        </div>

                        <!-- Sample growth -->
                        <div v-else-if="project.model.economic_growth.type.includes('Sample')">
                          <v-row>
                            <v-col cols="12" sm="4">
                              <v-text-field
                                label="Mean"
                                v-model="project.model.economic_growth.mean"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                              <v-text-field
                                label="Std"
                                v-model="project.model.economic_growth.std"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                              <v-text-field
                                label="Df"
                                v-model="project.model.economic_growth.df"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-select
                            v-model="project.model.economic_growth.interval"
                            :items="intervals_global"
                            label="Interval"
                          ></v-select>
                        </div>

                        <!-- Random Walk growth -->
                        <div v-else-if="project.model.economic_growth.type === 'Random Walk'">
                          <v-text-field
                            label="Initial"
                            v-model="project.model.economic_growth.initial"
                            suffix="%"
                          ></v-text-field>
                          <v-row>
                            <v-col cols="12" sm="4">
                              <v-text-field
                                label="Mean"
                                v-model="project.model.economic_growth.mean"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                              <v-text-field
                                label="Std"
                                v-model="project.model.economic_growth.std"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                              <v-text-field
                                label="Df"
                                v-model="project.model.economic_growth.df"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-select
                            v-model="project.model.economic_growth.interval"
                            :items="intervals_global"
                            label="Interval"
                          ></v-select>
                        </div>

                        <!-- Tabular growth -->
                        <div v-else-if="project.model.economic_growth.type === 'Tabular'">
                          <v-row
                            v-for="(step, index) in parseInt(project.model.steps) - 1"
                            :key="index"
                            style="margin-top: 0"
                          >
                            <v-col cols="12" style="margin-top: 0; padding-top: 0; margin-bottom: 0; padding-bottom: 0">
                              <v-text-field
                                :label="'Growth (' + project.model.interval + ': ' + (index + 1) + ' → ' + (index + 2) + ')'"
                                v-model="project.model.economic_growth.growth_values[index]"
                                suffix="%"
                                type="number"
                              >
                                <template v-slot:append>
                                  <v-btn
                                    icon="$mdi-arrow-down-right"
                                    size="x-small"
                                    variant="text"
                                    @click="fill_growth_tabular(
                                      project.model.economic_growth.growth_values[index],
                                      project.model.economic_growth.growth_values, 
                                      index
                                    )"
                                  ></v-btn>
                                </template>
                              </v-text-field>
                            </v-col>
                          </v-row>
                        </div>
                        <p class="caption">
                          The economic growth can be used as a common growth factor for occupancy rate of multiple income items. Interval can be smaller than the global interval. In this case values will be aggregated.
                        </p>
                      </template>
                    </v-card>
                  </v-col>
                  <!--  -->
                  <!--  -->

                  <v-col cols="12" md="4">
                    <v-card>
                      <template v-slot:title>
                        Discount Rate
                      </template>
                      <template v-slot:subtitle>
                        Rate of discounting future cash flows
                      </template>
                      <template v-slot:append>
                        <v-switch v-model="project.model.discount_rate.active" label="" hide-details></v-switch>
                      </template>
                      <template v-slot:text v-if="project.model.discount_rate.active">
                        <!-- Type selection -->
                        <v-select
                          v-model="project.model.discount_rate.type"
                          :items="['Fixed', 'Sample', 'Sample Once', 'Random Walk', 'Tabular']"
                          label="Discount rate type"
                        ></v-select>
                        <!-- Fixed growth -->
                        <div v-if="project.model.discount_rate.type === 'Fixed'">
                          <v-text-field
                            label="Fixed discount rate"
                            v-model="project.model.discount_rate.initial"
                            suffix="%"
                          ></v-text-field>
                          <v-select
                            v-model="project.model.discount_rate.interval"
                            :items="intervals_global"
                            label="Interval"
                          ></v-select>
                        </div>
                        <!-- Sample growth -->
                        <div v-else-if="project.model.discount_rate.type.includes('Sample')">
                          <v-row>
                            <v-col cols="12" sm="4">
                              <v-text-field
                                label="Mean"
                                v-model="project.model.discount_rate.mean"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                              <v-text-field
                                label="Std"
                                v-model="project.model.discount_rate.std"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                              <v-text-field
                                label="Df"
                                v-model="project.model.discount_rate.df"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-select
                            v-model="project.model.discount_rate.interval"
                            :items="intervals_global"
                            label="Interval"
                          ></v-select>
                        </div>
                        <!-- Random Walk growth -->
                        <div v-else-if="project.model.discount_rate.type === 'Random Walk'">
                          <v-text-field
                            label="Initial"
                            v-model="project.model.discount_rate.initial"
                            suffix="%"
                          ></v-text-field>
                          <v-row>
                            <v-col cols="12" sm="4">
                              <v-text-field
                                label="Mean"
                                v-model="project.model.discount_rate.mean"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                              <v-text-field
                                label="Std"
                                v-model="project.model.discount_rate.std"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                              <v-text-field
                                label="Df"
                                v-model="project.model.discount_rate.df"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-select
                            v-model="project.model.discount_rate.interval"
                            :items="intervals_global"
                            label="Interval"
                          ></v-select>
                        </div>
                        <!-- Tabular growth -->
                        <div v-else-if="project.model.discount_rate.type === 'Tabular'">
                          <v-row
                            v-for="(step, index) in parseInt(project.model.steps) - 1"
                            :key="index"
                            style="margin-top: 0"
                          >
                            <v-col cols="12" style="margin-top: 0; padding-top: 0; margin-bottom: 0; padding-bottom: 0">
                              <v-text-field
                                :label="'Discount Rate (' + project.model.interval + ': ' + (index + 1) + ')'"
                                v-model="project.model.discount_rate.growth_values[index]"
                                suffix="%"
                                type="number"
                              >
                                <template v-slot:append>
                                  <v-btn
                                    icon="$mdi-arrow-down-right"
                                    size="x-small"
                                    variant="text"
                                    @click="fill_growth_tabular(
                                      project.model.discount_rate.growth_values[index],
                                      project.model.discount_rate.growth_values, 
                                      index
                                    )"
                                  ></v-btn>
                                </template>
                              </v-text-field>
                            </v-col>
                          </v-row>
                        </div>
                      </template>
                    </v-card>
                  </v-col>
                </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Section 0: Property -->
          <!-- <v-expansion-panel id="panel_1" style="border-left: 3px solid #3e86ff"> -->
          <v-expansion-panel id="panel_1">
            <v-expansion-panel-title>
              Property
            </v-expansion-panel-title>
            <v-expansion-panel-text>
                <v-row>
                  <v-col cols="12">
                    <v-text-field label="Property Name" v-model="project.property.name"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-card>
                      <template v-slot:title>
                        Debt
                      </template>
                      <template v-slot:text>
                        <v-text-field label="Debt amount" v-model="project.property.debt.amount" suffix="$" type="number" min="0"></v-text-field>
                        <v-row>
                          <v-col cols="12" sm="6"><v-text-field label="Term, years" v-model="project.property.debt.term"></v-text-field></v-col>
                          <v-col cols="12" sm="6"><v-text-field label="Annual interest rate, %" v-model="project.property.debt.rate"></v-text-field></v-col>
                        </v-row>
                        <v-select
                          v-model="project.property.debt.interval"
                          :items="['Month', 'Year']"
                          label="Interval (amortization)"
                        ></v-select>
                      </template>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-card>
                      <template v-slot:title>
                        Purchase
                      </template>
                      <template v-slot:text>
                        <v-text-field label="Purchase price" v-model="project.property.purchase.price" suffix="$" type="number" min="0"></v-text-field>
                        <v-text-field label="Purchase costs" v-model="project.property.purchase.costs" suffix="$" type="number" min="0"></v-text-field>
                      </template>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-card>
                      <template v-slot:title>
                        Sale
                      </template>
                      <template v-slot:text>
                        <v-text-field label="Sale price" v-model="project.property.sale.price" suffix="$" type="number" min="0"></v-text-field>
                        <v-text-field label="Sale costs" v-model="project.property.sale.costs" suffix="$" type="number" min="0"></v-text-field>
                      </template>
                    </v-card>
                  </v-col>
                </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Section 1: Incomes -->
          <v-expansion-panel id="panel_2">
          <!-- <v-expansion-panel id="panel_2" style="border-left: 3px solid #aee26f"> -->
            <v-expansion-panel-title>
              Income <span style="font-weight: 200; padding-left: 10px; font-size: 20px"> ({{ project.income.items.length }})</span>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <!-- density="dense" -->
              <v-data-table
                density="default"
                :headers="incomeHeaders"
                :items="project.income.items"
                v-model:expanded="income_expanded"
                item-value="id"
                class="elevation-1"
                :mobile-breakpoint="0"
                :mobile="mobile"
                show-expand
                expand-icon="$mdi-chevron-down"
                expand-icon-expanded="$mdi-chevron-up"
                :row-props="obj => {
                  return {
                    style: !obj.item.active ? 'background: #EEE; opacity: 0.5;' : ''
                  }
                }"
              >
<!--  
              <template #item.data-table-expand="{ toggleExpand, isExpanded, item }">
                <v-btn
                  variant="text"
                  :icon="income_expanded.includes(item.id) ? '$mdi-chevron-up' : '$mdi-chevron-down'" 
                  @click="() => {
                  if (!this.income_expanded.includes(item.id)) this.income_expanded.push(item.id);
                  else this.income_expanded = this.income_expanded.filter((id) => id !== item.id);
                }"></v-btn>
              </template>
              -->
              <template #item.data-table-expand="{ toggleExpand, isExpanded, item, internalItem }">
                <v-btn
                  size="small"
                  variant="text"
                  :icon="isExpanded(internalItem) ? '$mdi-chevron-up' : '$mdi-chevron-down'" 
                  @click="toggleExpand(internalItem)">
                </v-btn>
              </template>
              <!-- 
                <template v-slot:item.actions="{ item }">
                  <v-btn
        size="small"
        variant="text"
        icon="$mdi-chevron-up" 
        @click="toggleExpand(internalItem)">
      </v-btn>
    </template>
    -->
              <template v-slot:expanded-row="{ columns, item }">
                <tr>
                  <td :colspan="columns.length">
                    <!-- Growth rate for {{ item.description }}. -->
                    <!-- Three blocks in three columns with amount, occupancy, growth-->
                    <v-container>

                      <v-row>
                        <!-- 
                        <v-col cols="4">
                          <v-card>
                            <template v-slot:title>
                              Amount
                            </template>
                            <template v-slot:subtitle>
                              How amount is calculated
                            </template>
                            <template v-slot:text>
                              <v-select
                                v-model="item.type"
                                :items="['Absolute', 'Relative']"
                                label="Amount type"
                              ></v-select>
                              <div v-if="item.type === 'Absolute'">
                                <v-text-field label="Value" v-model="item.amount" suffix="$"></v-text-field>
                                <v-row>
                                  <v-col cols="12" sm="6"><v-text-field label="Min" v-model="item.min"></v-text-field></v-col>
                                  <v-col cols="12" sm="6"><v-text-field label="Max" v-model="item.max"></v-text-field></v-col>
                                </v-row>
                                <v-select
                                  v-model="item.interval"
                                  :items="intervals"
                                  label="Update frequency"
                                ></v-select>
                              </div>
                              <div v-else>
                                <v-text-field label="Factor" v-model="item.interval"></v-text-field>
                              </div>
                            </template>
                          </v-card>
                        </v-col>
                         -->
                        <v-col cols="6">
                          <v-card>
                            <template v-slot:title>
                              Amount growth
                            </template>
                            <template v-slot:subtitle>
                              How amount changes over time
                            </template>
                            <template v-slot:text>
                              <v-select
                                v-model="item.amount_growth.type"
                                :items="['Fixed', 'Sample', 'Sample Once', 'Random Walk', 'Tabular', 'Inflation']"
                                label="Growth type"
                              ></v-select>
                              <div v-if="item.amount_growth.type === 'Fixed'">
                                <v-text-field label="Fixed growth" v-model="item.amount_growth.initial" suffix="%"></v-text-field>
                                <v-select
                                  v-model="item.amount_growth.interval"
                                  :items="intervals_global"
                                  label="Update frequency"
                                ></v-select>
                              </div>
                              <div v-else-if="item.amount_growth.type.includes('Sample')">
                                <v-row>
                                  <v-col cols="12" sm="4"><v-text-field label="Mean" v-model="item.amount_growth.mean"></v-text-field></v-col>
                                  <v-col cols="12" sm="4"><v-text-field label="Std" v-model="item.amount_growth.std"></v-text-field></v-col>
                                  <v-col cols="12" sm="4"><v-text-field label="Df" v-model="item.amount_growth.df"></v-text-field></v-col>
                                </v-row>
                                <v-select
                                  v-model="item.amount_growth.interval"
                                  :items="intervals_global"
                                  label="Update frequency"
                                ></v-select>
                              </div>
                              <div v-else-if="item.amount_growth.type === 'Random Walk'">
                                <v-text-field label="Initial" v-model="item.amount_growth.initial" suffix="%"></v-text-field>
                                <v-row>
                                  <v-col cols="12" sm="4"><v-text-field label="Mean" v-model="item.amount_growth.mean"></v-text-field></v-col>
                                  <v-col cols="12" sm="4"><v-text-field label="Std" v-model="item.amount_growth.std"></v-text-field></v-col>
                                  <v-col cols="12" sm="4"><v-text-field label="Df" v-model="item.amount_growth.df"></v-text-field></v-col>
                                </v-row>
                                <v-select
                                  v-model="item.amount_growth.interval"
                                  :items="intervals_global"
                                  label="Update frequency"
                                ></v-select>
                              </div>
                              <div v-else-if="item.amount_growth.type === 'Tabular'">
                                <!-- Create array of project.model.steps size -->
                                <v-row v-for="(step, index) in parseInt(project.model.steps)" :key="index" style="margin-top: 0">
                                  <v-col cols="12" sm="6" style="margin-top: 0; padding-top: 0; margin-bottom: 0; padding-bottom: 0">
                                    <v-text-field 
                                      :label="'Growth (' + project.model.interval + ': ' + (index + 1) + ')'" 
                                      v-if="index > 0"
                                      v-model="item.amount_growth.growth_values[index]" 
                                      v-on:update:model-value="update_growth_tabular(item.amount, item.amount_growth.target_values, item.amount_growth.growth_values, 0)"
                                      suffix="%"
                                      type="number"
                                    >
                                      <template v-slot:append>
                                        <v-btn 
                                          icon="$mdi-arrow-down-right"
                                          size="x-small"
                                          variant="text"
                                          @click="
                                            fill_growth_tabular(item.amount_growth.growth_values[index], item.amount_growth.growth_values, index); 
                                            update_growth_tabular(item.amount, item.amount_growth.target_values, item.amount_growth.growth_values, 0)
                                          "
                                        ></v-btn>
                                      </template>
                                    </v-text-field>
                                    <!-- :disabled="true" -->
                                    <v-text-field 
                                      :label="'Growth (' + project.model.interval + ': ' + (index + 1) + ')'" 
                                      v-else
                                      v-model="zero"
                                      suffix="%"
                                      type="number"
                                      min="0"
                                      max="0"
                                    >
                                      <template v-slot:append>
                                        <v-btn 
                                          icon="$mdi-arrow-down-right"
                                          size="x-small"
                                          variant="text"
                                          @click="
                                            fill_growth_tabular(0, item.amount_growth.growth_values, 0); 
                                            update_growth_tabular(item.amount, item.amount_growth.target_values, item.amount_growth.growth_values, 0)
                                          "
                                        ></v-btn>
                                      </template>
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6" style="margin-top: 0; padding-top: 0; margin-bottom: 0; padding-bottom: 0">
                                    <!-- On update trigger target_values updatte -->
                                    <v-text-field 
                                      :label="'Amount (' + project.model.interval + ': ' + (index + 1) + ')'" 
                                      v-if="index > 0"
                                      v-model="item.amount_growth.target_values[index]" suffix="$"
                                      v-on:update:model-value="update_growth_tabular(item.amount, item.amount_growth.target_values, item.amount_growth.growth_values, 1)"
                                      type="number"
                                      min="0"
                                    >
                                      <template v-slot:append>
                                        <v-btn 
                                          icon="$mdi-arrow-down-right"
                                          size="x-small"
                                          variant="text"
                                          
                                          @click="
                                            fill_growth_tabular(item.amount_growth.target_values[index], item.amount_growth.target_values, index); 
                                            update_growth_tabular(item.amount, item.amount_growth.target_values, item.amount_growth.growth_values, 1)
                                          "
                                        ></v-btn>
                                      </template>
                                    </v-text-field>
                                    <v-text-field 
                                      :label="'Amount (' + project.model.interval + ': ' + (index + 1) + ')'" 
                                      v-else
                                      suffix="$"
                                      v-model="item.amount"
                                      type="number"
                                      min="0"
                                    >
                                      <template v-slot:append>
                                        <v-btn 
                                          icon="$mdi-arrow-down-right"
                                          size="x-small"
                                          variant="text"
                                          @click="
                                            fill_growth_tabular(item.amount, item.amount_growth.target_values, 0); 
                                            update_growth_tabular(item.amount, item.amount_growth.target_values, item.amount_growth.growth_values, 1)
                                          "
                                        ></v-btn>
                                      </template>
                                    </v-text-field>
                                  </v-col>
                                </v-row>
                              </div>
                              <div v-else>
                                <v-text-field label="Factor" v-model="item.amount_growth.factor"></v-text-field>
                              </div>
                            </template>
                          </v-card>
                        </v-col>
                        <v-col cols="6">
                          <v-card>
                            <template v-slot:title>
                              Occupancy growth
                            </template>
                            <template v-slot:subtitle>
                              How many units are occupied
                            </template>
                            <template v-slot:text>
                              <v-select
                                v-model="item.occupancy_growth.type"
                                :items="['Fixed', 'Sample', 'Sample Once', 'Random Walk', 'Tabular', 'Economic Growth']"
                                label="Growth type"
                              ></v-select>
                              <div v-if="item.occupancy_growth.type === 'Fixed'">
                                <v-text-field label="Fixed growth" v-model="item.occupancy_growth.initial" suffix="%"></v-text-field>
                                <v-select
                                  v-model="item.occupancy_growth.interval"
                                  :items="intervals_global"
                                  label="Update frequency"
                                ></v-select>
                              </div>
                              <div v-else-if="item.occupancy_growth.type.includes('Sample')">
                                <v-row>
                                  <v-col cols="12" sm="4"><v-text-field label="Mean" v-model="item.occupancy_growth.mean"></v-text-field></v-col>
                                  <v-col cols="12" sm="4"><v-text-field label="Std" v-model="item.occupancy_growth.std"></v-text-field></v-col>
                                  <v-col cols="12" sm="4"><v-text-field label="Df" v-model="item.occupancy_growth.df"></v-text-field></v-col>
                                </v-row>
                                <v-select
                                  v-model="item.occupancy_growth.interval"
                                  :items="intervals_global"
                                  label="Update frequency"
                                ></v-select>
                              </div>
                              <div v-else-if="item.occupancy_growth.type === 'Random Walk'">
                                <v-text-field label="Initial" v-model="item.occupancy_growth.initial" suffix="%"></v-text-field>
                                <v-row>
                                  <v-col cols="12" sm="4"><v-text-field label="Mean" v-model="item.occupancy_growth.mean"></v-text-field></v-col>
                                  <v-col cols="12" sm="4"><v-text-field label="Std" v-model="item.occupancy_growth.std"></v-text-field></v-col>
                                  <v-col cols="12" sm="4"><v-text-field label="Df" v-model="item.occupancy_growth.df"></v-text-field></v-col>
                                </v-row>
                                <v-select
                                  v-model="item.occupancy_growth.interval"
                                  :items="intervals_global"
                                  label="Update frequency"
                                ></v-select>
                              </div>
                              <div v-else-if="item.occupancy_growth.type === 'Tabular'">
                                <!-- Create array of project.model.steps size -->
                                <v-row v-for="(step, index) in parseInt(project.model.steps)" :key="index" style="margin-top: 0">
                                  <v-col cols="12" sm="6" style="margin-top: 0; padding-top: 0; margin-bottom: 0; padding-bottom: 0">
                                    <v-text-field 
                                      :label="'Growth (' + project.model.interval + ': ' + (index + 1) + ')'" 
                                      v-if="index > 0"
                                      v-model="item.occupancy_growth.growth_values[index]" 
                                      v-on:update:model-value="update_growth_tabular(item.occupancy, item.occupancy_growth.target_values, item.occupancy_growth.growth_values, 0)"
                                      suffix="%"
                                      type="number"
                                    >
                                      <template v-slot:append>
                                        <v-btn 
                                          icon="$mdi-arrow-down-right"
                                          size="x-small"
                                          variant="text"
                                          @click="
                                            fill_growth_tabular(item.occupancy_growth.growth_values[index], item.occupancy_growth.growth_values, index); 
                                            update_growth_tabular(item.occupancy, item.occupancy_growth.target_values, item.occupancy_growth.growth_values, 0)
                                          "
                                        ></v-btn>
                                      </template>
                                    </v-text-field>
                                    <!-- :disabled="true" -->
                                    <v-text-field 
                                      :label="'Growth (' + project.model.interval + ': ' + (index + 1) + ')'" 
                                      v-else
                                      v-model="zero"
                                      suffix="%"
                                      type="number"
                                      min="0"
                                      max="0"
                                    >
                                      <template v-slot:append>
                                        <v-btn 
                                          icon="$mdi-arrow-down-right"
                                          size="x-small"
                                          variant="text"
                                          @click="
                                            fill_growth_tabular(0, item.occupancy_growth.growth_values, 0); 
                                            update_growth_tabular(item.occupancy, item.occupancy_growth.target_values, item.occupancy_growth.growth_values, 0)
                                          "
                                        ></v-btn>
                                      </template>
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6" style ="margin-top: 0; padding-top: 0; margin-bottom: 0; padding-bottom: 0">
                                    <!-- On update trigger target_values updatte -->
                                    <v-text-field 
                                      :label="'Occupancy (' + project.model.interval + ': ' + (index + 1) + ')'" 
                                      v-if="index > 0"
                                      v-model="item.occupancy_growth.target_values[index]" suffix="%"
                                      v-on:update:model-value="update_growth_tabular(item.occupancy, item.occupancy_growth.target_values, item.occupancy_growth.growth_values, 1)"
                                      type="number"
                                      min="0"
                                    >
                                      <template v-slot:append>
                                        <v-btn 
                                          icon="$mdi-arrow-down-right"
                                          size="x-small"
                                          variant="text"
                                          
                                          @click="
                                            fill_growth_tabular(item.occupancy_growth.target_values[index], item.occupancy_growth.target_values, index); 
                                            update_growth_tabular(item.occupancy, item.occupancy_growth.target_values, item.occupancy_growth.growth_values, 1)
                                          "
                                        ></v-btn>
                                      </template>
                                    </v-text-field>
                                    <v-text-field 
                                      :label="'Occupancy (' + project.model.interval + ': ' + (index + 1) + ')'" 
                                      v-else
                                      suffix="%"
                                      v-model="item.occupancy"
                                      type="number"
                                      min="0"
                                    >
                                      <template v-slot:append>
                                        <v-btn 
                                          icon="$mdi-arrow-down-right"
                                          size="x-small"
                                          variant="text"
                                          @click="
                                            fill_growth_tabular(item.occupancy, item.occupancy_growth.target_values, 0); 
                                            update_growth_tabular(item.occupancy, item.occupancy_growth.target_values, item.occupancy_growth.growth_values, 1)
                                          "
                                        ></v-btn>
                                      </template>
                                    </v-text-field>
                                  </v-col>
                                </v-row>
                              </div>
                              <div v-else>
                                <v-text-field label="Factor" v-model="item.occupancy_growth.factor"></v-text-field>
                              </div>
                            </template>
                          </v-card>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12">
                            <v-btn variant="flat" size="small" prepend-icon="$mdi-delete" @click="removeRow('income', item.id)">Delete</v-btn>
                            <v-btn variant="flat" size="small" prepend-icon="$mdi-content-copy" @click="cloneRow('income', item.id)">Clone</v-btn>
                        </v-col>
                      </v-row>
                    </v-container>
                  </td>
                </tr>
              </template>

                <template #footer.prepend>
            <!-- Any custom content, e.g. a button or text -->
                  <div style="display: flex; align-items: center; justify-content: flex-start; flex-grow: 1; margin-left: 10px">
                    <v-btn 
                      prepend-icon="$mdi-plus" 
                      color="black"
                      variant="outlined"
                      @click="add_row('income')"
                      style="margin-right: 10px"
                      rounded="0"
                    >Add Row</v-btn>
                    <v-btn 
                      :icon="mobile ? '$mdi-view-list' : '$mdi-view-module'"
                      color="black"
                      variant="outlined"
                      density="comfortable"
                      @click="toggle_view('income')"
                      style="margin-right: 10px"
                    ></v-btn>
                  </div>
          </template>

                <!-- Inline Text Field for Name -->
                <template #item.description="{ item }">
                  <VInlineTextarea
                    v-model="item.description"
                    name="description"
                    field-only
                    hide-details 
                    :icons="false"
                    hide-save-icon
                    hide-cancel-icon
                    :clearable="false"
                  />
                </template>

                <!-- Inline Numeric Field for Age -->
                <template #item.amount="{ item }">
                    <VInlineTextField
                    v-model="item.amount"
                    name="amount"
                    type="number"
                    min="0"
                    field-only
                    hide-details
                    :icons="false"
                    hide-save-icon
                    hide-cancel-icon
                    :clearable="false"
                    />
                </template>

                <template #item.units="{ item }">
                    <VInlineTextField
                    v-model="item.units"
                    name="units"
                    type="number"
                    min="1"
                    field-only
                    hide-details
                    :icons="false"
                    hide-save-icon
                    hide-cancel-icon
                    :clearable="false"
                    />
                </template>

                <template #item.occupancy="{ item }">
                    <VInlineTextField
                    v-model="item.occupancy"
                    name="occupancy"
                    type="number"
                    min="0"
                    max="100"
                    field-only
                    hide-details
                    :icons="false"
                    hide-save-icon
                    hide-cancel-icon
                    :clearable="false"
                    />
                </template>

                <!-- 
                <template #item.units="{ item }">
                  <VInlineSelect
                    v-model="item.units"
                    :items="incomeAmountUnits"
                    item-title="name"
                    item-value="code"
                    name="units"
                    field-only
                    hide-details
                    :icons="false"
                    hide-save-icon
                    hide-cancel-icon
                    :clearable="false"
                  />
                </template>
                 -->

                <template #item.interval="{ item }">
                  <VInlineSelect
                    v-model="item.interval"
                    :items="intervals_global"
                    item-title="name"
                    item-value="code"
                    name="interval"
                    field-only
                    hide-details
                    :icons="false"
                    hide-save-icon
                    hide-cancel-icon
                    :clearable="false"
                  />
                </template>

                <template #item.growth="{ item }">
                  <VInlineSwitch
                    v-model="item.growth"
                    name="growth"
                    field-only
                    hide-details
                    :icons="false"
                    hide-save-icon
                    hide-cancel-icon
                    :clearable="false"
                  />
                </template>
              
                <!-- Inline Switch Field for Active Status -->
                <template #item.active="{ item }">
                  <v-switch v-model="item.active" label="" hide-details></v-switch>
<!-- 
                  <VInlineSwitch
                    v-model="item.active"
                    name="active"
                    field-only
                    hide-details
                    :icons="false"
                    hide-save-icon
                    hide-cancel-icon
                    :clearable="false"
                    color="black"
                
                  />
                   -->
                </template>

                <!-- Inline Textarea for Comments -->
                <template #item.comments="{ item }">
                  <VInlineTextarea
                    v-model="item.comments"
                    name="comments"
                    field-only
                    hide-details 
                    :icons="false"
                    hide-save-icon
                    hide-cancel-icon
                    :clearable="false"
                  />
                </template>
              </v-data-table>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Section 2: Expenses -->
          <!-- <v-expansion-panel id="panel_3" style="border-left: 3px solid #ffcc04"> -->
          <v-expansion-panel id="panel_3">
            <v-expansion-panel-title>
              Expenses <span style="font-weight: 200; padding-left: 10px; font-size: 20px"> ({{ project.expenses.items.length }})</span>
            </v-expansion-panel-title>
            <v-expansion-panel-text>

              <h4 style="margin-top:30px">Operating expenses <span style="font-weight: 100;">(Included in Net Operating Income)</span></h4>
              <!-- Operating expenses -->
              <v-data-table
                density="default"
                :headers="expensesHeaders"
                :items="project.expenses.items"
                v-model:expanded="expenses_expanded"
                item-value="id"
                class="elevation-1"
                :mobile-breakpoint="0"
                :mobile="mobile"
                show-expand
                :row-props="obj => {
                  return {
                    style: !obj.item.active ? 'background: #EEE; opacity: 0.5;' : ''
                  }
                }"
              >
              <template #item.data-table-expand="{ toggleExpand, isExpanded, item, internalItem }">
                <v-btn
                  size="small"
                  variant="text"
                  :icon="isExpanded(internalItem) ? '$mdi-chevron-up' : '$mdi-chevron-down'" 
                  @click="toggleExpand(internalItem)">
                </v-btn>
              </template>

              <template v-slot:expanded-row="{ columns, item }">
                <tr>
                  <td :colspan="columns.length">
                    <!-- Growth rate for {{ item.description }}. -->
                    <!-- Three blocks in three columns with amount, occupancy, growth-->
                    <v-container>
                      <v-row>
                        <!-- 
                        <v-col cols="4">
                          <v-card>
                            <template v-slot:title>
                              Amount
                            </template>
                            <template v-slot:subtitle>
                              How amount is calculated
                            </template>
                            <template v-slot:text>
                              <v-select
                                v-model="item.type"
                                :items="['Absolute', 'Relative']"
                                label="Amount type"
                              ></v-select>
                              <div v-if="item.type === 'Absolute'">
                                <v-text-field label="Value" v-model="item.amount" suffix="$"></v-text-field>
                                <v-row>
                                  <v-col cols="12" sm="6"><v-text-field label="Min" v-model="item.min"></v-text-field></v-col>
                                  <v-col cols="12" sm="6"><v-text-field label="Max" v-model="item.max"></v-text-field></v-col>
                                </v-row>
                                <v-select
                                  v-model="item.interval"
                                  :items="intervals"
                                  label="Update frequency"
                                ></v-select>
                              </div>
                              <div v-else>
                                <v-text-field label="Factor" v-model="item.interval"></v-text-field>
                              </div>
                            </template>
                          </v-card>
                        </v-col>
                         -->
                        <v-col cols="6">
                          <v-card>
                            <template v-slot:title>
                              Amount growth
                            </template>
                            <template v-slot:subtitle>
                              How amount changes over time
                            </template>
                            <template v-slot:text>
                              <v-select
                                v-model="item.amount_growth.type"
                                :items="['Fixed', 'Sample', 'Sample Once', 'Random Walk', 'Tabular', 'Inflation']"
                                label="Growth type"
                              ></v-select>
                              <div v-if="item.amount_growth.type === 'Fixed'">
                                <v-text-field label="Fixed growth" v-model="item.amount_growth.initial" suffix="%"></v-text-field>
                                <v-select
                                  v-model="item.amount_growth.interval"
                                  :items="intervals_global"
                                  label="Update frequency"
                                ></v-select>
                              </div>
                              <div v-else-if="item.amount_growth.type.includes('Sample')">
                                <v-row>
                                  <v-col cols="12" sm="4"><v-text-field label="Mean" v-model="item.amount_growth.mean"></v-text-field></v-col>
                                  <v-col cols="12" sm="4"><v-text-field label="Std" v-model="item.amount_growth.std"></v-text-field></v-col>
                                  <v-col cols="12" sm="4"><v-text-field label="Df" v-model="item.amount_growth.df"></v-text-field></v-col>
                                </v-row>
                                <v-select
                                  v-model="item.amount_growth.interval"
                                  :items="intervals_global"
                                  label="Update frequency"
                                ></v-select>
                              </div>
                              <div v-else-if="item.amount_growth.type === 'Random Walk'">
                                <v-text-field label="Initial" v-model="item.amount_growth.initial" suffix="%"></v-text-field>
                                <v-row>
                                  <v-col cols="12" sm="4"><v-text-field label="Mean" v-model="item.amount_growth.mean"></v-text-field></v-col>
                                  <v-col cols="12" sm="4"><v-text-field label="Std" v-model="item.amount_growth.std"></v-text-field></v-col>
                                  <v-col cols="12" sm="4"><v-text-field label="Df" v-model="item.amount_growth.df"></v-text-field></v-col>
                                </v-row>
                                <v-select
                                  v-model="item.amount_growth.interval"
                                  :items="intervals_global"
                                  label="Update frequency"
                                ></v-select>
                              </div>
                              <div v-else-if="item.amount_growth.type === 'Tabular'">
                                <!-- Create array of project.model.steps size -->
                                <v-row v-for="(step, index) in parseInt(project.model.steps)" :key="index" style="margin-top: 0">
                                  <v-col cols="12" sm="6" style="margin-top: 0; padding-top: 0; margin-bottom: 0; padding-bottom: 0">
                                    <v-text-field 
                                      :label="'Growth (' + project.model.interval + ': ' + (index + 1) + ')'" 
                                      v-if="index > 0"
                                      v-model="item.amount_growth.growth_values[index]" 
                                      v-on:update:model-value="update_growth_tabular(item.amount, item.amount_growth.target_values, item.amount_growth.growth_values, 0)"
                                      suffix="%"
                                      type="number"
                                    >
                                      <template v-slot:append>
                                        <v-btn 
                                          icon="$mdi-arrow-down-right"
                                          size="x-small"
                                          variant="text"
                                          @click="
                                            fill_growth_tabular(item.amount_growth.growth_values[index], item.amount_growth.growth_values, index); 
                                            update_growth_tabular(item.amount, item.amount_growth.target_values, item.amount_growth.growth_values, 0)
                                          "
                                        ></v-btn>
                                      </template>
                                    </v-text-field>
                                    <!-- :disabled="true" -->
                                    <v-text-field 
                                      :label="'Growth (' + project.model.interval + ': ' + (index + 1) + ')'" 
                                      v-else
                                      v-model="zero"
                                      suffix="%"
                                      type="number"
                                      min="0"
                                      max="0"
                                    >
                                      <template v-slot:append>
                                        <v-btn 
                                          icon="$mdi-arrow-down-right"
                                          size="x-small"
                                          variant="text"
                                          @click="
                                            fill_growth_tabular(0, item.amount_growth.growth_values, 0); 
                                            update_growth_tabular(item.amount, item.amount_growth.target_values, item.amount_growth.growth_values, 0)
                                          "
                                        ></v-btn>
                                      </template>
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6" style="margin-top: 0; padding-top: 0; margin-bottom: 0; padding-bottom: 0">
                                    <!-- On update trigger target_values updatte -->
                                    <v-text-field 
                                      :label="'Amount (' + project.model.interval + ': ' + (index + 1) + ')'" 
                                      v-if="index > 0"
                                      v-model="item.amount_growth.target_values[index]" suffix="$"
                                      v-on:update:model-value="update_growth_tabular(item.amount, item.amount_growth.target_values, item.amount_growth.growth_values, 1)"
                                      type="number"
                                      min="0"
                                    >
                                      <template v-slot:append>
                                        <v-btn 
                                          icon="$mdi-arrow-down-right"
                                          size="x-small"
                                          variant="text"
                                          
                                          @click="
                                            fill_growth_tabular(item.amount_growth.target_values[index], item.amount_growth.target_values, index); 
                                            update_growth_tabular(item.amount, item.amount_growth.target_values, item.amount_growth.growth_values, 1)
                                          "
                                        ></v-btn>
                                      </template>
                                    </v-text-field>
                                    <v-text-field 
                                      :label="'Amount (' + project.model.interval + ': ' + (index + 1) + ')'" 
                                      v-else
                                      suffix="$"
                                      v-model="item.amount"
                                      type="number"
                                      min="0"
                                    >
                                      <template v-slot:append>
                                        <v-btn 
                                          icon="$mdi-arrow-down-right"
                                          size="x-small"
                                          variant="text"
                                          @click="
                                            fill_growth_tabular(item.amount, item.amount_growth.target_values, 0); 
                                            update_growth_tabular(item.amount, item.amount_growth.target_values, item.amount_growth.growth_values, 1)
                                          "
                                        ></v-btn>
                                      </template>
                                    </v-text-field>
                                  </v-col>
                                </v-row>
                              </div>
                              <div v-else>
                                <v-text-field label="Factor" v-model="item.amount_growth.factor"></v-text-field>
                              </div>
                            </template>
                          </v-card>
                        </v-col>
                        <v-col cols="6">
                          <v-card>
                            <template v-slot:title>
                              Amount type
                            </template>
                            <template v-slot:subtitle>
                              Absolute or relative expense
                            </template>
                            <template v-slot:text>
                              <v-select
                                v-model="item.type"
                                :items="['Absolute', 'Relative']"
                                label="Amount type"
                              ></v-select>
                              <div v-if="item.type === 'Absolute'">
                                <v-select
                                  :disabled="true"
                                  v-model="item.target"
                                  :items="relative_sources"
                                  label="Target"
                                ></v-select>
                                <v-row>
                                  <v-col cols="12" sm="6"><v-text-field label="Min, $" v-model="item.min" suffix="$"></v-text-field></v-col>
                                  <v-col cols="12" sm="6"><v-text-field label="Max, $" v-model="item.max" suffix="$"></v-text-field></v-col>
                                </v-row>
                                <v-select
                                  v-model="item.interval"
                                  :items="intervals_global"
                                  label="Update frequency"
                                ></v-select>
                              </div>
                              <div v-else>
                                <v-select
                                  v-model="item.target"
                                  :items="relative_sources"
                                  label="Target"
                                ></v-select>
                                <v-row>
                                  <v-col cols="12" sm="6"><v-text-field label="Min, $" v-model="item.min" suffix="$"></v-text-field></v-col>
                                  <v-col cols="12" sm="6"><v-text-field label="Max, $" v-model="item.max" suffix="$"></v-text-field></v-col>
                                </v-row>
                                <v-select
                                  v-model="item.interval"
                                  :items="intervals_global"
                                  label="Update frequency"
                                ></v-select>
                              </div>
                            </template>
                          </v-card>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12">
                            <v-btn variant="flat" size="small" prepend-icon="$mdi-delete" @click="removeRow('expenses', item.id)">Delete</v-btn>
                            <v-btn variant="flat" size="small" prepend-icon="$mdi-content-copy" @click="cloneRow('expenses', item.id)">Clone</v-btn>
                        </v-col>
                      </v-row>
                    </v-container>
                  </td>
                </tr>
              </template>

                  <template #footer.prepend>
            <!-- Any custom content, e.g. a button or text -->
                  <div style="display: flex; align-items: center; justify-content: flex-start; flex-grow: 1; margin-left: 10px">
                    <v-btn 
                      prepend-icon="$mdi-plus" 
                      color="black"
                      variant="outlined"
                      @click="add_row('expenses')"
                      style="margin-right: 10px"
                      rounded="0"
                    >Add Row</v-btn>
                    <v-btn 
                      :icon="mobile ? '$mdi-view-list' : '$mdi-view-module'"
                      color="black"
                      variant="outlined"
                      density="comfortable"
                      @click="toggle_view('expenses')"
                      style="margin-right: 10px"
                    ></v-btn>
                  </div>
          </template>

                <!-- Inline Text Field for Name -->
                <template #item.description="{ item }">
                  <VInlineTextarea
                    v-model="item.description"
                    name="description"
                    field-only
                    hide-details 
                    :icons="false"
                    hide-save-icon
                    hide-cancel-icon
                    :clearable="false"
                  />
                </template>

                <!-- Inline Numeric Field for Age -->
                <template #item.amount="{ item }">
                    <VInlineTextField
                    v-model="item.amount"
                    name="amount"
                    type="number"
                    min="0"
                    field-only
                    hide-details
                    :icons="false"
                    hide-save-icon
                    hide-cancel-icon
                    :clearable="false"
                    />
                </template>

                <template #item.units="{ item }">
                    <VInlineTextField
                    v-model="item.units"
                    name="units"
                    type="number"
                    min="1"
                    field-only
                    hide-details
                    :icons="false"
                    hide-save-icon
                    hide-cancel-icon
                    :clearable="false"
                    />
                </template>

                <template #item.occupancy="{ item }">
                    <VInlineTextField
                    v-model="item.occupancy"
                    name="occupancy"
                    type="number"
                    min="0"
                    max="100"
                    field-only
                    hide-details
                    :icons="false"
                    hide-save-icon
                    hide-cancel-icon
                    :clearable="false"
                    />
                </template>

                <!-- 
                <template #item.units="{ item }">
                  <VInlineSelect
                    v-model="item.units"
                    :items="incomeAmountUnits"
                    item-title="name"
                    item-value="code"
                    name="units"
                    field-only
                    hide-details
                    :icons="false"
                    hide-save-icon
                    hide-cancel-icon
                    :clearable="false"
                  />
                </template>
                 -->

                <template #item.type="{ item }">
                  <VInlineSelect
                    v-model="item.type"
                    :items="['Absolute', 'Relative']"
                    item-title="name"
                    item-value="code"
                    name="type"
                    field-only
                    hide-details
                    :icons="false"
                    hide-save-icon
                    hide-cancel-icon
                    :clearable="false"
                  />
                </template>

                <template #item.target="{ item }">
                  <VInlineSelect
                    v-model="item.target"
                    :disabled="item.type == 'Absolute'"
                    :items="relative_sources"
                    item-title="name"
                    item-value="code"
                    name="target"
                    field-only
                    hide-details
                    :icons="false"
                    hide-save-icon
                    hide-cancel-icon
                    :clearable="false"
                  />
                </template>

                <template #item.interval="{ item }">
                  <VInlineSelect
                    v-model="item.interval"
                    :items="intervals_global"
                    item-title="name"
                    item-value="code"
                    name="interval"
                    field-only
                    hide-details
                    :icons="false"
                    hide-save-icon
                    hide-cancel-icon
                    :clearable="false"
                  />
                </template>

                <template #item.growth="{ item }">
                  <VInlineSwitch
                    v-model="item.growth"
                    name="growth"
                    field-only
                    hide-details
                    :icons="false"
                    hide-save-icon
                    hide-cancel-icon
                    :clearable="false"
                  />
                </template>

                <!-- Inline Switch Field for Active Status -->
                <template #item.active="{ item }">
                  <v-switch v-model="item.active" label="" hide-details></v-switch>
                  <!--  
                    <VInlineSwitch
                    v-model="item.active"
                    name="active"
                    field-only
                    hide-details
                    :icons="false"
                    hide-save-icon
                    hide-cancel-icon
                    :clearable="false"
                    />
                  -->
                </template>

                <!-- Inline Textarea for Comments -->
                <template #item.comments="{ item }">
                  <VInlineTextarea
                    v-model="item.comments"
                    name="comments"
                    field-only
                    hide-details 
                    :icons="false"
                    hide-save-icon
                    hide-cancel-icon
                    :clearable="false"
                  />
                </template>
              </v-data-table>

              <h4 style="margin-top:30px">Capital expenditures <span style="font-weight: 100;">(Not included in Net Operating Income)</span></h4>
              <!-- Capital expenses -->
              <v-data-table
                density="default"
                :headers="expensesHeaders"
                :items="project.capex.items"
                v-model:expanded="capex_expanded"
                item-value="id"
                class="elevation-1"
                :mobile-breakpoint="0"
                :mobile="mobile"
                show-expand
                :row-props="obj => {
                  return {
                    style: !obj.item.active ? 'background: #EEE; opacity: 0.5;' : ''
                  }
                }"
              >
              <template #item.data-table-expand="{ toggleExpand, isExpanded, item, internalItem }">
                <v-btn
                  size="small"
                  variant="text"
                  :icon="isExpanded(internalItem) ? '$mdi-chevron-up' : '$mdi-chevron-down'" 
                  @click="toggleExpand(internalItem)">
                </v-btn>
              </template>

              <template v-slot:expanded-row="{ columns, item }">
                <tr>
                  <td :colspan="columns.length">
                    <!-- Growth rate for {{ item.description }}. -->
                    <!-- Three blocks in three columns with amount, occupancy, growth-->
                    <v-container>
                      <v-row>
                        <!-- 
                        <v-col cols="4">
                          <v-card>
                            <template v-slot:title>
                              Amount
                            </template>
                            <template v-slot:subtitle>
                              How amount is calculated
                            </template>
                            <template v-slot:text>
                              <v-select
                                v-model="item.type"
                                :items="['Absolute', 'Relative']"
                                label="Amount type"
                              ></v-select>
                              <div v-if="item.type === 'Absolute'">
                                <v-text-field label="Value" v-model="item.amount" suffix="$"></v-text-field>
                                <v-row>
                                  <v-col cols="12" sm="6"><v-text-field label="Min" v-model="item.min"></v-text-field></v-col>
                                  <v-col cols="12" sm="6"><v-text-field label="Max" v-model="item.max"></v-text-field></v-col>
                                </v-row>
                                <v-select
                                  v-model="item.interval"
                                  :items="intervals"
                                  label="Update frequency"
                                ></v-select>
                              </div>
                              <div v-else>
                                <v-text-field label="Factor" v-model="item.interval"></v-text-field>
                              </div>
                            </template>
                          </v-card>
                        </v-col>
                         -->
                        <v-col cols="6">
                          <v-card>
                            <template v-slot:title>
                              Amount growth
                            </template>
                            <template v-slot:subtitle>
                              How amount changes over time
                            </template>
                            <template v-slot:text>
                              <v-select
                                v-model="item.amount_growth.type"
                                :items="['Fixed', 'Sample', 'Sample Once', 'Random Walk', 'Tabular', 'Inflation']"
                                label="Growth type"
                              ></v-select>
                              <div v-if="item.amount_growth.type === 'Fixed'">
                                <v-text-field label="Fixed growth" v-model="item.amount_growth.initial" suffix="%"></v-text-field>
                                <v-select
                                  v-model="item.amount_growth.interval"
                                  :items="intervals_global"
                                  label="Update frequency"
                                ></v-select>
                              </div>
                              <div v-else-if="item.amount_growth.type.includes('Sample')">
                                <v-row>
                                  <v-col cols="12" sm="4"><v-text-field label="Mean" v-model="item.amount_growth.mean"></v-text-field></v-col>
                                  <v-col cols="12" sm="4"><v-text-field label="Std" v-model="item.amount_growth.std"></v-text-field></v-col>
                                  <v-col cols="12" sm="4"><v-text-field label="Df" v-model="item.amount_growth.df"></v-text-field></v-col>
                                </v-row>
                                <v-select
                                  v-model="item.amount_growth.interval"
                                  :items="intervals_global"
                                  label="Update frequency"
                                ></v-select>
                              </div>
                              <div v-else-if="item.amount_growth.type === 'Random Walk'">
                                <v-text-field label="Initial" v-model="item.amount_growth.initial" suffix="%"></v-text-field>
                                <v-row>
                                  <v-col cols="12" sm="4"><v-text-field label="Mean" v-model="item.amount_growth.mean"></v-text-field></v-col>
                                  <v-col cols="12" sm="4"><v-text-field label="Std" v-model="item.amount_growth.std"></v-text-field></v-col>
                                  <v-col cols="12" sm="4"><v-text-field label="Df" v-model="item.amount_growth.df"></v-text-field></v-col>
                                </v-row>
                                <v-select
                                  v-model="item.amount_growth.interval"
                                  :items="intervals_global"
                                  label="Update frequency"
                                ></v-select>
                              </div>
                              <div v-else-if="item.amount_growth.type === 'Tabular'">
                                <!-- Create array of project.model.steps size -->
                                <v-row v-for="(step, index) in parseInt(project.model.steps)" :key="index" style="margin-top: 0">
                                  <v-col cols="12" sm="6" style="margin-top: 0; padding-top: 0; margin-bottom: 0; padding-bottom: 0">
                                    <v-text-field 
                                      :label="'Growth (' + project.model.interval + ': ' + (index + 1) + ')'" 
                                      v-if="index > 0"
                                      v-model="item.amount_growth.growth_values[index]" 
                                      v-on:update:model-value="update_growth_tabular(item.amount, item.amount_growth.target_values, item.amount_growth.growth_values, 0)"
                                      suffix="%"
                                      type="number"
                                    >
                                      <template v-slot:append>
                                        <v-btn 
                                          icon="$mdi-arrow-down-right"
                                          size="x-small"
                                          variant="text"
                                          @click="
                                            fill_growth_tabular(item.amount_growth.growth_values[index], item.amount_growth.growth_values, index); 
                                            update_growth_tabular(item.amount, item.amount_growth.target_values, item.amount_growth.growth_values, 0)
                                          "
                                        ></v-btn>
                                      </template>
                                    </v-text-field>
                                    <!-- :disabled="true" -->
                                    <v-text-field 
                                      :label="'Growth (' + project.model.interval + ': ' + (index + 1) + ')'" 
                                      v-else
                                      v-model="zero"
                                      suffix="%"
                                      type="number"
                                      min="0"
                                      max="0"
                                    >
                                      <template v-slot:append>
                                        <v-btn 
                                          icon="$mdi-arrow-down-right"
                                          size="x-small"
                                          variant="text"
                                          @click="
                                            fill_growth_tabular(0, item.amount_growth.growth_values, 0); 
                                            update_growth_tabular(item.amount, item.amount_growth.target_values, item.amount_growth.growth_values, 0)
                                          "
                                        ></v-btn>
                                      </template>
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6" style="margin-top: 0; padding-top: 0; margin-bottom: 0; padding-bottom: 0">
                                    <!-- On update trigger target_values updatte -->
                                    <v-text-field 
                                      :label="'Amount (' + project.model.interval + ': ' + (index + 1) + ')'" 
                                      v-if="index > 0"
                                      v-model="item.amount_growth.target_values[index]" suffix="$"
                                      v-on:update:model-value="update_growth_tabular(item.amount, item.amount_growth.target_values, item.amount_growth.growth_values, 1)"
                                      type="number"
                                      min="0"
                                    >
                                      <template v-slot:append>
                                        <v-btn 
                                          icon="$mdi-arrow-down-right"
                                          size="x-small"
                                          variant="text"
                                          
                                          @click="
                                            fill_growth_tabular(item.amount_growth.target_values[index], item.amount_growth.target_values, index); 
                                            update_growth_tabular(item.amount, item.amount_growth.target_values, item.amount_growth.growth_values, 1)
                                          "
                                        ></v-btn>
                                      </template>
                                    </v-text-field>
                                    <v-text-field 
                                      :label="'Amount (' + project.model.interval + ': ' + (index + 1) + ')'" 
                                      v-else
                                      suffix="$"
                                      v-model="item.amount"
                                      type="number"
                                      min="0"
                                    >
                                      <template v-slot:append>
                                        <v-btn 
                                          icon="$mdi-arrow-down-right"
                                          size="x-small"
                                          variant="text"
                                          @click="
                                            fill_growth_tabular(item.amount, item.amount_growth.target_values, 0); 
                                            update_growth_tabular(item.amount, item.amount_growth.target_values, item.amount_growth.growth_values, 1)
                                          "
                                        ></v-btn>
                                      </template>
                                    </v-text-field>
                                  </v-col>
                                </v-row>
                              </div>
                              <div v-else>
                                <v-text-field label="Factor" v-model="item.amount_growth.factor"></v-text-field>
                              </div>
                            </template>
                          </v-card>
                        </v-col>
                        <v-col cols="6">
                          <v-card>
                            <template v-slot:title>
                              Amount type
                            </template>
                            <template v-slot:subtitle>
                              Absolute or relative expense
                            </template>
                            <template v-slot:text>
                              <v-select
                                v-model="item.type"
                                :items="['Absolute', 'Relative']"
                                label="Amount type"
                              ></v-select>
                              <div v-if="item.type === 'Absolute'">
                                <v-select
                                  :disabled="true"
                                  v-model="item.target"
                                  :items="relative_sources"
                                  label="Target"
                                ></v-select>
                                <v-row>
                                  <v-col cols="12" sm="6"><v-text-field label="Min, $" v-model="item.min" suffix="$"></v-text-field></v-col>
                                  <v-col cols="12" sm="6"><v-text-field label="Max, $" v-model="item.max" suffix="$"></v-text-field></v-col>
                                </v-row>
                                <v-select
                                  v-model="item.interval"
                                  :items="intervals_global"
                                  label="Update frequency"
                                ></v-select>
                              </div>
                              <div v-else>
                                <v-select
                                  v-model="item.target"
                                  :items="relative_sources"
                                  label="Target"
                                ></v-select>
                                <v-row>
                                  <v-col cols="12" sm="6"><v-text-field label="Min, $" v-model="item.min" suffix="$"></v-text-field></v-col>
                                  <v-col cols="12" sm="6"><v-text-field label="Max, $" v-model="item.max" suffix="$"></v-text-field></v-col>
                                </v-row>
                                <v-select
                                  v-model="item.interval"
                                  :items="intervals_global"
                                  label="Update frequency"
                                ></v-select>
                              </div>
                            </template>
                          </v-card>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12">
                            <v-btn variant="flat" size="small" prepend-icon="$mdi-delete" @click="removeRow('expenses', item.id)">Delete</v-btn>
                            <v-btn variant="flat" size="small" prepend-icon="$mdi-content-copy" @click="cloneRow('expenses', item.id)">Clone</v-btn>
                        </v-col>
                      </v-row>
                    </v-container>
                  </td>
                </tr>
              </template>

                  <template #footer.prepend>
            <!-- Any custom content, e.g. a button or text -->
                  <div style="display: flex; align-items: center; justify-content: flex-start; flex-grow: 1; margin-left: 10px">
                    <v-btn 
                      prepend-icon="$mdi-plus" 
                      color="black"
                      variant="outlined"
                      @click="add_row('capex')"
                      style="margin-right: 10px"
                      rounded="0"
                    >Add Row</v-btn>
                    <v-btn 
                      :icon="mobile ? '$mdi-view-list' : '$mdi-view-module'"
                      color="black"
                      variant="outlined"
                      density="comfortable"
                      @click="toggle_view('capex')"
                      style="margin-right: 10px"
                    ></v-btn>
                  </div>
          </template>

                <!-- Inline Text Field for Name -->
                <template #item.description="{ item }">
                  <VInlineTextarea
                    v-model="item.description"
                    name="description"
                    field-only
                    hide-details 
                    :icons="false"
                    hide-save-icon
                    hide-cancel-icon
                    :clearable="false"
                  />
                </template>

                <!-- Inline Numeric Field for Age -->
                <template #item.amount="{ item }">
                    <VInlineTextField
                    v-model="item.amount"
                    name="amount"
                    type="number"
                    min="0"
                    field-only
                    hide-details
                    :icons="false"
                    hide-save-icon
                    hide-cancel-icon
                    :clearable="false"
                    />
                </template>

                <template #item.units="{ item }">
                    <VInlineTextField
                    v-model="item.units"
                    name="units"
                    type="number"
                    min="1"
                    field-only
                    hide-details
                    :icons="false"
                    hide-save-icon
                    hide-cancel-icon
                    :clearable="false"
                    />
                </template>

                <template #item.occupancy="{ item }">
                    <VInlineTextField
                    v-model="item.occupancy"
                    name="occupancy"
                    type="number"
                    min="0"
                    max="100"
                    field-only
                    hide-details
                    :icons="false"
                    hide-save-icon
                    hide-cancel-icon
                    :clearable="false"
                    />
                </template>

                <!-- 
                <template #item.units="{ item }">
                  <VInlineSelect
                    v-model="item.units"
                    :items="incomeAmountUnits"
                    item-title="name"
                    item-value="code"
                    name="units"
                    field-only
                    hide-details
                    :icons="false"
                    hide-save-icon
                    hide-cancel-icon
                    :clearable="false"
                  />
                </template>
                 -->

                <template #item.type="{ item }">
                  <VInlineSelect
                    v-model="item.type"
                    :items="['Absolute', 'Relative']"
                    item-title="name"
                    item-value="code"
                    name="type"
                    field-only
                    hide-details
                    :icons="false"
                    hide-save-icon
                    hide-cancel-icon
                    :clearable="false"
                  />
                </template>

                <template #item.target="{ item }">
                  <VInlineSelect
                    v-model="item.target"
                    :disabled="item.type == 'Absolute'"
                    :items="relative_sources"
                    item-title="name"
                    item-value="code"
                    name="target"
                    field-only
                    hide-details
                    :icons="false"
                    hide-save-icon
                    hide-cancel-icon
                    :clearable="false"
                  />
                </template>

                <template #item.interval="{ item }">
                  <VInlineSelect
                    v-model="item.interval"
                    :items="intervals_global"
                    item-title="name"
                    item-value="code"
                    name="interval"
                    field-only
                    hide-details
                    :icons="false"
                    hide-save-icon
                    hide-cancel-icon
                    :clearable="false"
                  />
                </template>

                <template #item.growth="{ item }">
                  <VInlineSwitch
                    v-model="item.growth"
                    name="growth"
                    field-only
                    hide-details
                    :icons="false"
                    hide-save-icon
                    hide-cancel-icon
                    :clearable="false"
                  />
                </template>

                <!-- Inline Switch Field for Active Status -->
                <template #item.active="{ item }">
                  <v-switch v-model="item.active" label="" hide-details></v-switch>
                  <!--  
                    <VInlineSwitch
                    v-model="item.active"
                    name="active"
                    field-only
                    hide-details
                    :icons="false"
                    hide-save-icon
                    hide-cancel-icon
                    :clearable="false"
                    />
                  -->
                </template>

                <!-- Inline Textarea for Comments -->
                <template #item.comments="{ item }">
                  <VInlineTextarea
                    v-model="item.comments"
                    name="comments"
                    field-only
                    hide-details 
                    :icons="false"
                    hide-save-icon
                    hide-cancel-icon
                    :clearable="false"
                  />
                </template>
              </v-data-table>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Section 3: Debt -->
           <!-- 
            <v-expansion-panel id="panel_4" style="border-left: 3px solid #f94b84">
              <v-expansion-panel-title>
              Debt
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-form>
                <v-text-field label="Project Name" v-model="project_name"></v-text-field>
                <v-text-field label="Last Name"></v-text-field>
                <v-text-field label="Email"></v-text-field>
              </v-form>
            </v-expansion-panel-text>
          </v-expansion-panel>
          -->

          <!-- Section 3: Debt -->
          <!-- <v-expansion-panel id="panel_5" style="border-left: 3px solid #f94b84"> -->
          <v-expansion-panel id="panel_4">
            <v-expansion-panel-title>
              Taxes
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-row>
                <v-col cols="12" md="4">
                  <v-card>
                    <template v-slot:title>
                      Depreciation
                    </template>
                    <template v-slot:text>
                      <!-- Depreciable -->
                      <v-text-field label="Depreciation Amount" v-model="project.taxes.depreciation.amount" suffix="%" type="number" min="0"></v-text-field>
                      <v-text-field label="Recovery Period" v-model="project.taxes.depreciation.period" suffix="years" type="number" min="0"></v-text-field>
                    </template>
                  </v-card>
                </v-col>
                <v-col cols="12" md="4">
                  <v-card>
                    <template v-slot:title>
                      Disposition Taxes
                    </template>
                    <template v-slot:text>
                      <v-text-field label="Capital Gains Tax Rate" v-model="project.taxes.capital_gains_tax_rate" suffix="%" type="number" min="0"></v-text-field>
                      <v-text-field label="Recapture Tax Rate" v-model="project.taxes.recapture_tax_rate" suffix="%" type="number" min="0"></v-text-field>
                    </template>
                  </v-card>
                </v-col>
                <v-col cols="12" md="4">
                  <v-card>
                    <template v-slot:title>
                      Marginal Taxes
                    </template>
                    <template v-slot:text>
                      <v-text-field label="Marginal Tax Rate" v-model="project.taxes.marginal_tax_rate" suffix="%" type="number" min="0"></v-text-field>
                    </template>
                  </v-card>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel id="panel_5">
            <v-expansion-panel-title>
              Import/Export
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-row>
                <v-col cols="12" >
                  The JSON code below is a dynamic representation of the project. 
                  It updates automatically as you fill in the project inputs above. 
                  Similarly, the project itself updates as you edit the code. 
                  This allows you to directly paste output from LLMs here or simply store it in a text file.
                </v-col>
                <v-col cols="12" >
                  <v-textarea
                    id="project-code"
                    label="Project code"
                    v-model="project_code"
                    name="project_code"
                    variant="filled"
                    auto-grow
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
  </v-container>
      <v-container id="results-container" v-if="has_results">
        <v-row id="panel_6">
          <v-col cols="12">
            <v-card variant="text">
              <template v-slot:text>
                <h1 id="property-title"> {{ project.property.name }}</h1>
              </template>
            </v-card>
          </v-col>
        </v-row>  

  
        <v-row id="panel_6">
          <v-col cols="12" md="4">
            <v-card variant="text">
              <template v-slot:title>
                Summary
              </template>
              <template v-slot:text>
                <div id="description-property"></div>
              </template>
            </v-card>
          </v-col>
          <v-col cols="12" md="8">
            <v-card variant="text">
              <template v-slot:title>
                Discounted Cash Flow
              </template>
              <template v-slot:text>
                <div id="results-property"></div>
              </template>
            </v-card>
          </v-col>
        </v-row>
        <v-row >
          <v-col cols="12" md="4">
            <v-card variant="text">
              <template v-slot:title>
                Inflation
              </template>
              <template v-slot:text>
                <v-slider
                  class="no-print"
                  v-model="project.model.inflation.initial"
                  :max="30"
                  :min="0"
                  density="compact"
                  track-size="2"
                  thumb-size="14"
                  thumb-label
                  v-on:end="on_change_inflation"
                ></v-slider>
                <!-- <div class="text-caption"> Set fixed inflation </div> -->
                <div id="results-inflation"></div>
              </template>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card variant="text">
              <template v-slot:title>
                Economic Growth
              </template>
              <template v-slot:text>
                <v-slider
                  class="no-print"
                  v-model="project.model.economic_growth.initial"
                  :max="30"
                  :min="0"
                  density="compact"
                  track-size="2"
                  thumb-size="14"
                  thumb-label
                  v-on:end="on_change_economic_growth"
                ></v-slider>
                <!-- <div class="text-caption"> Set fixed economic growth </div> -->
                <div id="results-economic-growth"></div>
              </template>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card variant="text">
              <template v-slot:title>
                Discount Rate
              </template>
              <template v-slot:text>
                <v-slider
                  class="no-print"
                  v-model="project.model.discount_rate.initial"
                  :max="30"
                  :min="0"
                  density="compact"
                  track-size="2"
                  thumb-size="14"
                  thumb-label
                  v-on:end="on_change_discount_rate"
                ></v-slider>
                <!-- <div class="text-caption"> Set fixed discount rate </div> -->
                <div id="results-discount-rate"></div>
              </template>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-card variant="text">
              <template v-slot:title>
                Debt balance
              </template>
              <template v-slot:text>
                <div id="results-debt-balance"></div>
              </template>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card variant="text">
              <template v-slot:title>
                Debt service
              </template>
              <template v-slot:text>
                <div id="results-debt-service"></div>
              </template>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card variant="text">
              <template v-slot:title>
                Incomes and Expenses
              </template>
              <template v-slot:text>
                <div id="results-ie"></div>
              </template>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-card variant="text">
              <template v-slot:title>
                Incomes <span style="font-weight: 200;">(monthly)</span>
              </template>
              <template v-slot:text>
                <div id="results-incomes-circular"></div>
              </template>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card variant="text">
              <template v-slot:title>
                Expenses <span style="font-weight: 200;">(monthly)</span>
              </template>
              <template v-slot:text>
                <div id="results-expenses-circular"></div>
              </template>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card variant="text">
              <template v-slot:title>
                Debt  <span style="font-weight: 200;">(monthly)</span>
              </template>
              <template v-slot:text>
                <div id="results-debt-circular"></div>
              </template>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card variant="text">
              <template v-slot:title>
                Before Tax Cash Flow <span style="font-weight: 200;">(BTCF)</span>
              </template>
              <template v-slot:text>
                <div id="results-btcf"></div>
              </template>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card variant="text">
              <template v-slot:title>
                After Tax Cash Flow <span style="font-weight: 200;">(ATCF)</span>
              </template>
              <template v-slot:text>
                <div id="results-atcf"></div>
              </template>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-card variant="text">
              <template v-slot:title>
                Before Tax IRR <span style="font-weight: 200;">(annual)</span>
              </template>
              <template v-slot:text>
                <div id="results-btirr" style="position: relative;"></div>
              </template>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card variant="text">
              <template v-slot:title>
                After Tax IRR <span style="font-weight: 200;">(annual)</span>
              </template>
              <template v-slot:text>
                <div id="results-atirr" style="position: relative;"></div>
              </template>
            </v-card>
          </v-col>
        </v-row>
          <!-- 
            <v-col cols="4">
              <v-card variant="text">
                <template v-slot:title>
                Inflation
              </template>
              <template v-slot:text>
                <div id="results-1"></div>
              </template>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card variant="text">
              <template v-slot:title>
                Discount Rate
              </template>
              <template v-slot:text>
                <div id="results-2"></div>
              </template>
            </v-card>
          </v-col>
          -->
        <div id="results"></div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import * as Plot from "@observablehq/plot"
import * as Inputs from "@observablehq/inputs"
// import style from inputs dist/index.css
import "@observablehq/inputs/dist/index.css"
import * as projects from "./projects"
import { de, fa } from "vuetify/locale"
import LZString from 'lz-string'

import pkg from '../package.json'

// import htl
import { html } from "htl"

function PMT(rate, periods, present, future = 0, type = 0) {
  // Validate that rate and periods are numbers.
  if (typeof rate !== 'number' || typeof periods !== 'number') {
    return NaN;
  }

  // When the interest rate is 0, use a simple division.
  if (rate === 0) {
    return -((present + future) / periods);
  }

  // Calculate the compound term (1 + rate)^periods.
  const term = Math.pow(1 + rate, periods);

  // For type 0 (payments due at end of period)
  // and type 1 (payments due at beginning of period),
  // the formula slightly differs.
  if (type === 1) {
    return - (rate * (present * term + future)) / ((term - 1) * (1 + rate));
  } else {
    return - (rate * (present * term + future)) / (term - 1);
  }
}

function PV(rate, nper, pmt, fv = 0, type = 0) {
  // Validate that all inputs are numbers.
  if (
    typeof rate !== 'number' ||
    typeof nper !== 'number' ||
    typeof pmt !== 'number' ||
    typeof fv !== 'number' ||
    typeof type !== 'number'
  ) {
    return NaN;
  }

  // When the interest rate is 0, the formula simplifies to:
  // PV = -(pmt * nper + fv)
  if (rate === 0) {
    return -(pmt * nper + fv);
  }

  // For non-zero rate, the present value is calculated as:
  // PV = -[ pmt*(1 + rate*type)*(1 - (1+rate)^(-nper))/rate + fv*(1+rate)^(-nper) ]
  const pv = -(
    pmt * (1 + rate * type) * (1 - Math.pow(1 + rate, -nper)) / rate +
    fv * Math.pow(1 + rate, -nper)
  );
  return pv;
}

function NPV(cashFlows, discountRates) {
  let npv = 0;
  let discountFactor = 1;

  // Loop over all cash flows
  for (let t = 0; t < cashFlows.length; t++) {
    // For t > 0, update the cumulative discount factor.
    if (t > 0) {
      // discountRates[t - 1] is the discount rate for the t-th period.
      discountFactor *= (1 + discountRates[t - 1] / 100);
    }
    // Accumulate the present value.
    npv += cashFlows[t] / discountFactor;
  }
  return npv;
}

function IRR(cashFlows, guess = 0.1) {
  const tolerance = 1e-7;      // How close to zero we need the NPV change to be.
  const maxIterations = 1000;  // Maximum number of iterations allowed.
  let rate = guess;            // Starting guess for IRR.

  for (let iter = 0; iter < maxIterations; iter++) {
    let npv = 0;
    let dNPV = 0;

    // Calculate NPV and its derivative at the current rate.
    for (let t = 0; t < cashFlows.length; t++) {
      npv += cashFlows[t] / Math.pow(1 + rate, t);
      // For t=0 the derivative term is 0 because it's constant.
      if (t > 0) {
        dNPV -= t * cashFlows[t] / Math.pow(1 + rate, t + 1);
      }
    }

    // Newton-Raphson formula to update the rate.
    const newRate = rate - npv / dNPV;
    
    // If the rate change is very small, we have converged.
    if (Math.abs(newRate - rate) < tolerance) {
      return newRate;
    }
    
    rate = newRate;
  }
  
  // If convergence wasn't reached, return the current estimate.
  return rate;
}

function mean(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// Simple population std function
function std(arr) {
  const m = mean(arr);
  const variance = arr.reduce((acc, v) => acc + (v - m) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}

function binomial(n, p) {
  let successes = 0;
  for (let i = 0; i < n; i++) {
    if (Math.random() < p) successes++;
  }
  return successes;
}

function normal(mean, std) {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * std + mean;
}

// Standard Normal using the Box-Muller transform
function normalRandom() {
  let u = Math.random();
  let v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// Gamma random variable using Marsaglia and Tsang algorithm
// Generates a sample from Gamma(alpha, beta) where alpha is the shape and beta is the scale.
function gammaRandom(alpha, beta) {
  if (alpha < 1) {
    // Use the method for alpha < 1: generate gamma for (alpha + 1) then adjust.
    return gammaRandom(1 + alpha, beta) * Math.pow(Math.random(), 1 / alpha);
  }
  const d = alpha - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  while (true) {
    const Z = normalRandom();
    const U = Math.random();
    const V = Math.pow(1 + c * Z, 3);
    if (V > 0 && Math.log(U) < 0.5 * Z * Z + d - d * V + d * Math.log(V)) {
      return d * V * beta;
    }
  }
}

// Chi-square random variable as a special case of gamma:
// chiSquareRandom(df) ~ Gamma(df/2, 2)
function chiSquareRandom(df) {
  return gammaRandom(df / 2, 2);
}

// Student-t random variable with parameters: mean, std (scale), and degrees of freedom (df)
// Sampling: t = Z / sqrt(V/df) where Z ~ N(0,1) and V ~ chi-square(df)
function student_t(mean, std, df) {
  const Z = normalRandom();
  const V = chiSquareRandom(df);
  const t = Z / Math.sqrt(V / df);
  return mean + std * t;
}

function parse_interval(frequency) {
  switch (frequency.toLowerCase()) {
    case 'month':
      return 1;
    case 'quarter':
      return 3;
    case 'year':
      return 12;
    default:
      return 1;
  }
}

function aggregate_samples(data) {
  // 1. Group objects by month
  const grouped = {};
  data.forEach(d => {
    if (!grouped[d.month]) {
      grouped[d.month] = [];
    }
    grouped[d.month].push(d);
  });

  // 2. For each group (month), compute means and std for each numeric field
  const aggregated = [];
  for (const month in grouped) {
    const rows = grouped[month];

    // Start building the aggregated row
    const result = { month: +month };

    // Figure out which fields to aggregate 
    // (exclude grouping keys like "month" or "sample", or anything non-numeric)
    const fields = Object.keys(rows[0]).filter(
      k => !['month', 'sample'].includes(k)
    );

    fields.forEach(field => {
      const values = rows.map(r => r[field]);
      // Compute mean and std using your existing mean/std functions
      const avg = mean(values);
      const s = std(values);

      // Store them in the aggregated object
      result[field] = avg;           // e.g. atcf => mean
      result[field + '_std'] = s;    // e.g. atcf_std => std
    });

    aggregated.push(result);
  }
  return aggregated;
}

function describe_property(project, results) {
  const { model, property } = project;
  let description = '';
  // description += `<h1>${property.name}</h1>`
  // Property name and holding period
  description += `<h2 style="font-size: 22px;font-weight: 900;"><span style="background: black; color: white; padding: 2px 10px; font-weight: 900;">NPV</span> ${results.npv}</h2>`;
  description += `<h2 style="font-size: 22px;font-weight: 900;"><span style="background: black; color: white; padding: 2px 10px; font-weight: 900;">IRR</span> ${results.irr}%</h2>`;
  description += `<p style="margin-top: 10px; font-size: 12px; padding-right: 20px;">`
  description += `${property.name} is a property held for <strong>${model.steps} ${model.interval.toLowerCase()}s</strong>. `;

  // Debt details
  if (property.debt && property.debt.amount > 0) {
    description += `It is financed with a debt of $${Number(property.debt.amount).toLocaleString()} over ${property.debt.term} year${property.debt.term > 1 ? 's' : ''} at an interest rate of ${property.debt.rate}%. `;
  } else {
    description += `It is purchased without external financing. `;
  }

  // Purchase and Sale information
  description += `The property was purchased for $${Number(property.purchase.price).toLocaleString()} plus costs of $${Number(property.purchase.costs).toLocaleString()}, and it is projected to sell for $${Number(property.sale.price).toLocaleString()} with sale costs of $${Number(property.sale.costs).toLocaleString()}. `;

  // Simulation model details
  description += `The ${model.samples > 1 ? 'Monte Carlo ' : ''}simulation runs for ${model.steps} ${model.interval.toLowerCase()} step${model.steps > 1 ? 's' : ''} using ${model.samples} sample${model.samples !== 1 ? 's' : ''}. `;

  // Economic growth description
  if (model.economic_growth && model.economic_growth.active) {
    description += `Economic growth is modeled using a ${model.economic_growth.type.toLowerCase()} approach starting at ${model.economic_growth.initial.toFixed(2)}%. `;
  } else {
    description += `Economic growth is not explicitly modeled. `;
  }

  // Inflation description
  if (model.inflation && model.inflation.active) {
    description += `Inflation is active and is modeled as ${model.inflation.type.toLowerCase()} with an initial rate of ${model.inflation.initial.toFixed(2)}%. `;
  } else {
    description += `Inflation is not factored into this simulation. `;
  }

  // Discount rate description
  description += `The discount rate is set at ${model.discount_rate.initial.toFixed(2)}% using a ${model.discount_rate.type.toLowerCase()} approach.`;
  description += `</p>`;
  return description;
}

function describe_debt_balance(project, results_data_aggregated) {
  // Get the initial debt amount
  const initial_debt = parseFloat(project.property.debt.amount)
  const purchase_price = parseFloat(project.property.purchase.price)
  // Calculate the debt-to-purchase price ratio (in percentage)
  const debt_ratio = purchase_price > 0 ? (initial_debt / purchase_price) * 100 : 0;
  // Get the last simulated debt balance from aggregated results
  const last_debt_balance = results_data_aggregated[results_data_aggregated.length - 1]['debt_balance']

  let description = ''

  if (initial_debt > 0) {
    description = `<p style="margin-top: 10px; font-size: 12px; padding-right: 20px;">
      The property was initially financed with a debt of <strong>$${Number(initial_debt).toLocaleString()}</strong>, which represents approximately <strong>${debt_ratio.toFixed(2)}%</strong> of the purchase price of $${Number(purchase_price).toLocaleString()}. 
      According to the simulation, the debt balance has decreased to <strong>$${Number(last_debt_balance).toLocaleString()}</strong> by the end of the holding period.
    </p>`
  } else {
    description = `<p style="margin-top: 10px; font-size: 12px; padding-right: 20px;">
      The property was purchased without external financing. 
      The debt balance remains at <strong>$${Number(last_debt_balance).toLocaleString()}</strong> by the end of the holding period.
    </p>`
  }

  return description;
}

function describe_debt_service(results_data_aggregated) {
  // Calculate the ratio (debt_paid / net_operating_income) for each entry.
  const ratios = results_data_aggregated.map(x => {
    const noi = parseFloat(x['net_operating_income']);
    // Avoid division by zero; if net operating income is zero, treat ratio as zero.
    return noi > 0 ? (parseFloat(x['debt_paid']) / noi) * 100 : 0;
  });
  // Compute the average ratio using the mean function.
  const ratio_avg = mean(ratios);

  // Optionally, compute the average debt_paid and net_operating_income for reference.
  const debt_service = parseFloat(results_data_aggregated[0]['debt_paid'])
  const noi_avg = mean(results_data_aggregated.map(x => parseFloat(x['net_operating_income'])))

  let description = `<p style="margin-top: 10px; font-size: 12px; padding-right: 20px;">`
  description += `Across the simulation, the periodic debt service payment was <strong>$${Number(debt_service).toLocaleString()}</strong>`
  if (noi_avg > 0) {
    description += `, which represents approximately <strong>${ratio_avg.toFixed(2)}%</strong> of the average net operating income of $${Number(noi_avg).toLocaleString()}. `
  } else {
    description += `. As the net operating income is reported as <strong>$${Number(noi_avg).toLocaleString()}</strong>, the ratio is not available. `
  }
  description += `</p>`

  return description;
}

// Example usage:
// console.log("Sample from Student-t:", student_t(0, 1, 10));

// console.log(examples)
export default {
  // Properties returned from data() become reactive state
  // and will be exposed on `this`.
  data() {
    return {
      version: pkg.version,
      zero: 0,
      active_panels: [0,1,2,3,4],
      showAlert: false,
      drawer: true,
      has_results: false,
      project: null,
      project_code: '',
      discrete_occupancy: true,
      first_run: true,
      results: {
        npv: 0,
        npv_std: 0,
        irr: 0,
        irr_std: 0,
      },
      incomeHeaders: [
        { title: 'Description', value: 'description', minWidth: 250, sortable: true },
        { title: 'Amount, $', value: 'amount' , minWidth: 150, sortable: true },
        { title: 'Num. of units', value: 'units' , minWidth: 150, sortable: true },
        { title: 'Occupancy, %', value: 'occupancy' , minWidth: 150, sortable: true },
        { title: 'Interval', value: 'interval' , minWidth: 150, sortable: true },
        { title: 'Active', value: 'active' , minWidth: 70 },
        // { title: '', key: 'actions', sortable: false },
      ],
      expensesHeaders: [
        { title: 'Description', value: 'description', minWidth: 250, sortable: true },
        { title: 'Amount', value: 'amount' , minWidth: 150, sortable: true },
        { title: 'Type', value: 'type' , minWidth: 150, sortable: true },
        { title: 'Target', value: 'target' , minWidth: 150, sortable: true },
        { title: 'Interval', value: 'interval' , minWidth: 150, sortable: true },
        { title: 'Active', value: 'active' , minWidth: 70 },
      ],
      intervals_global: [
        'Month',
        'Quarter',
        'Year',
      ],
      incomeAmountUnits: [
        'Total',
        'Per area',
      ],
      mobile: false,
      countries: [
        { code: 'US', name: 'United States' },
        { code: 'UK', name: 'United Kingdom' },
        { code: 'CA', name: 'Canada' },
        { code: 'AU', name: 'Australia' },
        { code: 'DE', name: 'Germany' },
      ],
      income_expanded: [],
      expenses_expanded: [],
      capex_expanded: [],
    }
  },
  computed: {
    /*
    interval() {
      const economic_growth_interval = parse_interval(this.project.model.economic_growth.interval)
      const inflation_interval = parse_interval(this.project.model.inflation.interval)
      const discount_rate_interval = parse_interval(this.project.model.discount_rate.interval)

      const intervals = [economic_growth_interval, inflation_interval, discount_rate_interval]
      // iterate over incomes and expenses to determine the maximum frequency
      this.project.income.items.forEach(item => {
        intervals.push(parse_interval(item.interval))
        if (item.amount_growth.type === 'Custom') {
          intervals.push(parse_interval(item.amount_growth.interval))
        }
        if (item.occupancy_growth.type === 'Custom') {
          intervals.push(parse_interval(item.occupancy_growth.interval))
        }
      })
      this.project.expenses.items.forEach(item => {
        intervals.push(parse_interval(item.interval))
        if (item.amount_growth.type === 'Custom') {
          intervals.push(parse_interval(item.amount_growth.interval))
        }
      })

      return Math.min(...intervals)
    },
    */
    intervals() {
      let interval = parse_interval(this.project.model.interval)
      console.log('Interval:', interval, this.project.model.interval)
      if (interval === 1) {
        return ['Month', 'Quarter', 'Year']
      } else if (interval === 3) {
        return ['Quarter', 'Year']
      } else {
        return ['Year']
      }
    },
    relative_sources() {
      let sources = []
      this.project.income.items.forEach(item => {
        if (item.active) {
          sources.push(item.description + ' ($ total)')
          sources.push(item.description + ' (occupied)')
        }
      })
      sources.push('Gross Income')
      sources.push('Net Operating Income')
      return sources
    }
    // income_expanded() {
    //   // Return array of income indices that contain item.growth === true
    //   return this.project.income.items.map((item, index) => {
    //     if (item.growth) return index
    //   }).filter((index) => index !== undefined)
    // },
  },
  // Methods are functions that mutate state and trigger updates.
  // They can be bound as event handlers in templates.
  methods: {
    fill_growth_tabular(value, arr, i) {
      for (let j = i; j < this.project.model.steps; j++) {
        arr[j] = value
      }
    },
    update_growth_tabular(baseAmount, amountValues, growthValues, flag) {
      // Ensure there is at least one period (the base period)
      baseAmount = parseFloat(baseAmount)
      console.log('Updating growth tabular:', baseAmount, amountValues, growthValues, flag)

      if (!Array.isArray(amountValues) || !Array.isArray(growthValues)) return;

      // Set period 0: base amount and zero growth
      if (amountValues.length === 0) {
        amountValues.push(baseAmount);
      } else {
        amountValues[0] = baseAmount;
      }
      if (growthValues.length === 0) {
        growthValues.push(0);
      } else {
        growthValues[0] = 0;
      }

      // Determine how many periods we have (using the longer array length)
      const len = Math.max(amountValues.length, growthValues.length);

      if (flag === 0) {
        // Flag 1: update target_values from growth_values.
        // For period 1 and beyond, each amount is the previous amount multiplied by (1 + growth_rate/100)
        for (let i = 1; i < len; i++) {
          const growthRate = growthValues[i] ? Number(growthValues[i]) : 0;
          const previousAmount = (amountValues[i - 1] !== undefined) ? amountValues[i - 1] : baseAmount;
          amountValues[i] = previousAmount * (1 + growthRate / 100);
        }
      } else if (flag === 1) {
        // Flag 0: update growth_values from target_values.
        // For period 1 and beyond, the growth rate is derived from the change from the previous period.
        for (let i = 1; i < len; i++) {
          if (amountValues[i - 1] !== 0) {
            growthValues[i] = ((amountValues[i] / amountValues[i - 1]) - 1) * 100;
          } else {
            growthValues[i] = 0;
          }
        }
      }
    },
    shuffle_logo() {
      for (let i=1; i<=5; i++) {
        let el = document.getElementById(`logo-${i}`)
        let shift = Math.round(Math.random() * 30 - 15)
        el.style.top = `${shift}px`
      }
    },
    add_row(table) {
      const id = this.project[table].items.length + 1
      const newRow = {
        id: id,
        description: `Item ${id}`,
        active: true,
        amount: 0,
        interval: 'Year',
        min: null,
        max: null,
        amount_growth: {
          initial: 0,
          mean: 0,
          std: 0,
          df: 0,
          type: 'Fixed',
          interval: 'Month',
          factor: 1,
          target_values: [],
          growth_values: [],
        }
      }
      if (table === 'income') {
        newRow.units = 1
        newRow.occupancy = 100
        newRow.occupancy_growth = {
          initial: 0,
          mean: 0,
          std: 0,
          df: 0,
          type: 'Fixed',
          interval: 'Month',
          factor: 1,
          target_values: [],
          growth_values: [],
        }
      } else if (table === 'expenses') {
        newRow.type = 'Absolute'
        newRow.target = 'None'
      }
      this.project[table].items.push(newRow)
    },
    toggle_view(table) {
      console.log('Toggling view...')
      this.mobile = !this.mobile
    },
    goToPanel(panel) {
      // Set the active panel by finding its index
      if (!this.active_panels.includes(panel)) {
        this.active_panels.push(panel)
        this.active_panels = this.active_panels.sort()
      }
      if (panel === 5) {
        // Results 
        console.log('Go to results panel')
        if (!this.has_results) {
          console.log('No results: running simulation...')
          this.run()
        }
      }
      this.$nextTick(() => {
        const el = document.getElementById(`panel_${panel}`)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      })
    },
    load_example(index) {
      console.log('Loading example', index)
      const project_loaded = JSON.parse(JSON.stringify(projects[`example_${index}`]))
      this.project = this.merge_with_defaults(project_loaded)
      this.active_panels = [0,1,2,3,4]
      this.has_results = false
    },
    round(value) {
      const precision = this.project.model.precision || 0
      const factor = Math.pow(10, precision);
      return Math.round(value * factor) / factor;
    },
    run(autorun = false) {
      this.first_run = false
      console.log('Start run:', new Date())
      // Model params
      const model_interval = parse_interval(this.project.model.interval) // How many months in one step
      const model_frequency = 12 / model_interval // How many steps in one year
      const model_steps = parseInt(this.project.model.steps) // Number of steps to project into the future
      const model_months = model_steps * model_interval // Number of months to project into the future

      const economic_growth_interval = this.project.model.economic_growth.type === 'Tabular' 
        ? model_interval
        : parse_interval(this.project.model.economic_growth.interval)
      const inflation_interval = this.project.model.inflation.type === 'Tabular'
        ? model_interval
        : parse_interval(this.project.model.inflation.interval)
      const discount_rate_interval = parse_interval(this.project.model.discount_rate.interval)

      // Debt
      const debt_interval = parse_interval(this.project.property.debt.interval) // 1 or 12
      const debt_frequency = 12 / debt_interval // How many debt payments per year
      const debt_rate_per_debt_interval = parseFloat(this.project.property.debt.rate) / (100 * debt_frequency)
      const debt_periods = parseInt(this.project.property.debt.term) * debt_frequency
      const debt_amount = parseFloat(this.project.property.debt.amount)
      const debt_service_per_debt_interval = debt_amount > 0
        ? -PMT(
          debt_rate_per_debt_interval,
          debt_periods,
          debt_amount
        )
        : 0
      console.log(`PMT(rate=${debt_rate_per_debt_interval}, periods=${debt_periods}, present=${debt_amount}) = ${debt_service_per_debt_interval}`)
      console.log('Debt service per debt interval:', debt_service_per_debt_interval, typeof debt_service_per_debt_interval)
      console.log('Debt interaval:', debt_interval, typeof debt_interval)
      console.log('Model interval:', model_interval, typeof model_interval)
      const debt_service_per_model_interval = (debt_interval < model_interval)
        ? debt_service_per_debt_interval * model_interval / debt_interval
        : debt_service_per_debt_interval
      console.log(`Debt service: ${debt_service_per_model_interval} (debt_interval=${debt_interval}, model_interval=${model_interval})`)

      const purchase_price = parseFloat(this.project.property.purchase.price)
      const purchase_costs = parseFloat(this.project.property.purchase.costs)
      const purchase_basis = purchase_price + purchase_costs
      const initial_equity = purchase_basis - debt_amount

      const sale_price = parseFloat(this.project.property.sale.price)
      const sale_costs = parseFloat(this.project.property.sale.costs)
      const net_sale = sale_price - sale_costs

      // Depreciation
      const depreciation_rate = parseFloat(this.project.taxes.depreciation.amount) / 100
      const depreciation_period = parseFloat(this.project.taxes.depreciation.period)
      const depreciation_per_month = depreciation_rate * purchase_price / (depreciation_period * 12)
      // const depreciation_per_model_interval = depreciation_rate * purchase_price / (depreciation_period * model_frequency)
      // console.log(`Depreciation: ${depreciation_per_model_interval}`)

      // Prepare an array to hold the cumulative income per month.
      let results_data = []

      let effective_gross_income_max = 0
      let expenses_max = 0

      let btirr_samples = []
      let atirr_samples = []
      let pbtirr_samples = []
      let patirr_samples = []
      let npv_samples = []
      let total_tax_samples = []

      for (let sample = 0; sample < parseInt(this.project.model.samples); sample++) {


        function print(...msg) {
          if (sample === 0) {
            console.log(...msg)
          }
        }
        let incomes = JSON.parse(JSON.stringify(this.project.income.items))
        let expenses = JSON.parse(JSON.stringify(this.project.expenses.items))
        let capex = JSON.parse(JSON.stringify(this.project.capex.items))

        let economic_growth =  this.project.model.economic_growth.active 
          ? this.project.model.economic_growth.type === 'Tabular'
            ? parseFloat(this.project.model.economic_growth.growth_values[0])
            : parseFloat(this.project.model.economic_growth.initial)
          : 0
        let inflation = this.project.model.inflation.active 
          ? this.project.model.inflation.type === 'Tabular'
            ? parseFloat(this.project.model.inflation.growth_values[0])
            : parseFloat(this.project.model.inflation.initial)
          : 0
        let discount_rate = this.project.model.discount_rate.active 
          ? this.project.model.discount_rate.type === 'Tabular'
            ? parseFloat(this.project.model.discount_rate.growth_values[0])
            : parseFloat(this.project.model.discount_rate.initial)
          : 0

        // Loop over each month
        let debt_balance_prev = debt_amount
        let debt_balance_new = 0
        let debt_service_paid = 0
        let debt_principal_paid = 0
        let debt_interest_paid = 0

        let potential_income_per_model_interval = 0
        let effective_gross_income_per_model_interval = 0
        let expenses_per_model_interval = 0
        let capex_per_model_interval = 0
        let depreciation_per_model_interval = 0

        // results_data.push({
        //   sample,
        //   step: 0,
        //   month: 0,
        //   economic_growth,
        //   inflation,
        //   discount_rate,
        //   debt_paid: 0,
        //   debt_interest_paid,
        //   debt_principal_paid,
        //   debt_balance: debt_balance_prev,
        //   effective_gross_income_per_model_interval,
        //   potential_income_per_model_interval,
        //   expenses_per_model_interval: -expenses_per_model_interval,
        //   net_operating_income: 0,
        //   btcf: 0,
        //   taxes: 0,
        //   atcf: 0
        // })

        let btcfs = []
        let atcfs = []
        let pbtcfs = []
        let patcfs = []
        let discount_rates = []

        // let month = 0
        // while (month < model_months) {
        //   month += 1
        let step = 0
        for (let month = 1; month <= model_months; month ++) {
          // Depreciation
          if ((month == 1) || (month == model_months)) {
            depreciation_per_model_interval += depreciation_per_month / 2
          } else {
            depreciation_per_model_interval += depreciation_per_month
          }
          // We still perform monthly steps in case some variables need to be aggregated

          // Debt
          if (debt_balance_prev > 0) {
            if (month % debt_interval === 0) {
              debt_balance_new = PV(
                debt_rate_per_debt_interval, 
                debt_periods - month / debt_interval,
                -debt_service_per_debt_interval
              )
              const debt_principal_paid_current = debt_balance_prev - debt_balance_new
              const debt_interest_paid_current = debt_service_per_debt_interval - debt_principal_paid_current
              debt_principal_paid += debt_principal_paid_current
              debt_interest_paid += debt_interest_paid_current
              debt_service_paid += debt_service_per_debt_interval
              debt_balance_prev = debt_balance_new
            } 
          } else {
            debt_balance_new = 0
            debt_balance_prev = 0
            debt_interest_paid = 0
            debt_principal_paid = 0
            debt_service_paid = 0
          }



          // INCOMES
          incomes.filter(item => item.active).forEach(item => {
            // Determine the monthly factor based on frequency
            const units_total = parseInt(item.units)
            const item_interval = parse_interval(item.interval)
            const amount_growth_interval =  parse_interval(item.amount_growth.interval)
            const occupancy_growth_interval = parse_interval(item.occupancy_growth.interval)

            const item_amount = parseFloat(item.amount)
            const occupancy = parseFloat(item.occupancy)

            // It's possible to round occupancy to the nearest integer
            // const units_occupied = this.discrete_occupancy ?:
            const units_occupied = this.discrete_occupancy && units_total > 1
              ? Math.round(units_total * occupancy / 100)
              : units_total * occupancy / 100

            // Increment aggregated income
            if (month % item_interval === 0) {
              effective_gross_income_per_model_interval += item_amount * units_occupied
              potential_income_per_model_interval += item_amount * units_total
            }

            // Update the item amount, amount growth
            if ((item.amount_growth.type === 'Fixed') && (month % amount_growth_interval === 0)) {
              item.amount = item_amount * (1 + parseFloat(item.amount_growth.initial) / 100)
            } else if (item.amount_growth.type.includes('Sample') && (month % amount_growth_interval === 0)) {
              if ((step === 0) || (item.amount_growth.type === 'Sample')) {
                item.amount_growth.initial = student_t(
                  parseFloat(item.amount_growth.mean),
                  parseFloat(item.amount_growth.std),
                  parseFloat(item.amount_growth.df)
                )
                print('Sample:', sample, 'Step:', step, 'Month:', month, 'Amount:', item.amount_growth.initial)
              }
              item.amount = item_amount * (1 + parseFloat(item.amount_growth.initial) / 100)
            } else if ((item.amount_growth.type === 'Random Walk') && (month % amount_growth_interval === 0)) {
              item.amount = item_amount * (1 + parseFloat(item.amount_growth.initial) / 100)
              item.amount_growth.initial = parseFloat(item.amount_growth.initial) + student_t(
                parseFloat(item.amount_growth.mean),
                parseFloat(item.amount_growth.std),
                parseFloat(item.amount_growth.df)
              )
            } else if (item.amount_growth.type === 'Tabular') {
              // Tabular growth is aligned with the model interval (total number of steps)
              // Simulation loop goes over each month, so we need to increment the step
              item.amount = item.amount_growth.target_values[step + 1] || 0
            } else if ((item.amount_growth.type === 'Inflation') && (month % inflation_interval === 0)) {
              item.amount = item_amount * (1 + inflation / 100)
            }

            // Update occupancy, occupancy growth
            if ((item.occupancy_growth.type === 'Fixed') && (month % occupancy_growth_interval === 0)) {
              item.occupancy = occupancy * (1 + parseFloat(item.occupancy_growth.initial) / 100)
            } else if ((item.occupancy_growth.type === 'Random Walk') && (month % occupancy_growth_interval === 0)) {
              item.occupancy = occupancy * (1 + parseFloat(item.occupancy_growth.initial) / 100)
              item.occupancy_growth.initial = parseFloat(item.occupancy_growth.initial) + student_t(
                parseFloat(item.occupancy_growth.mean),
                parseFloat(item.occupancy_growth.std),
                parseFloat(item.occupancy_growth.df)
              )
            } else if (item.occupancy_growth.type === 'Tabular') {
              // Tabular growth is aligned with the model interval (total number of steps)
              // Simulation loop goes over each month, so we need to increment the step
              item.occupancy = item.occupancy_growth.target_values[step + 1] || 0
            } else if ((item.occupancy_growth.type === 'Economic Growth') && (month % economic_growth_interval === 0)) {
              print('Month:', month, 'Economic growth:', economic_growth, 'Occupancy:', item.occupancy, 'Vacancy:', 100 - item.occupancy)
              item.occupancy = occupancy * (1 + economic_growth / 100)
            }
            if (item.occupancy < 0) item.occupancy = 0
            if (item.occupancy > 100) item.occupancy = 100
          });

          // Update max values
          effective_gross_income_max = Math.max(effective_gross_income_max, effective_gross_income_per_model_interval)

          // EXPENSES
          expenses.filter(item => item.active).forEach(item => {
            // Determine the monthly factor based on frequency
            const item_interval = parse_interval(item.interval)
            const amount_growth_interval =  parse_interval(item.amount_growth.interval)
            const item_amount = parseFloat(item.amount)

            // Calculate base monthly amount
            if (month % item_interval === 0) {
              if (item.type === 'Absolute') {
                expenses_per_model_interval += item_amount
              } else if (item.type === 'Relative') {
                // Ok, here's the tricky part
                // We need to determine the target income source per current item interval

                let target = item.target
                let targetAmount = 0
                if (target === 'Gross Income') {
                  targetAmount = effective_gross_income_per_model_interval
                } else if (target === 'Net Operating Income') {
                  targetAmount = effective_gross_income_per_model_interval - expenses_per_model_interval
                } else {
                  let targetItem = incomes.find(i => i.description === target)
                  targetAmount = parseFloat(targetItem.amount) * parseInt(targetItem.units)
                }
                expenses_per_model_interval += targetAmount * item_amount
              }
            }
            if ((item.amount_growth.type === 'Fixed') && (month % amount_growth_interval === 0)) {
              item.amount = item_amount * (1 + parseFloat(item.amount_growth.initial) / 100)
            } else if ((item.amount_growth.type === 'Random Walk') && (month % amount_growth_interval === 0)) {
              item.amount = item_amount * (1 + parseFloat(item.amount_growth.initial) / 100)
              item.amount_growth.initial = parseFloat(item.amount_growth.initial) + student_t(
                parseFloat(item.amount_growth.mean),
                parseFloat(item.amount_growth.std),
                parseFloat(item.amount_growth.df)
              )
            } else if (item.amount_growth.type === 'Tabular') {
              // Tabular growth is aligned with the model interval (total number of steps)
              // Simulation loop goes over each month, so we need to increment the step
              item.amount = item.amount_growth.target_values[step + 1] || 0
            } else if ((item.amount_growth.type === 'Inflation') && (month % inflation_interval === 0)) {
              item.amount = item_amount * (1 + inflation / 100)
            }
          })

          // EXPENSES
          capex.filter(item => item.active).forEach(item => {
            // Determine the monthly factor based on frequency
            const item_interval = parse_interval(item.interval)
            const amount_growth_interval =  parse_interval(item.amount_growth.interval)
            const item_amount = parseFloat(item.amount)

            // Calculate base monthly amount
            if (month % item_interval === 0) {
              if (item.type === 'Absolute') {
                capex_per_model_interval += item_amount
              } else if (item.type === 'Relative') {
                // Ok, here's the tricky part
                // We need to determine the target income source per current item interval

                let target = item.target
                let targetAmount = 0
                if (target === 'Gross Income') {
                  targetAmount = effective_gross_income_per_model_interval
                } else if (target === 'Net Operating Income') {
                  targetAmount = effective_gross_income_per_model_interval - expenses_per_model_interval
                } else {
                  let targetItem = incomes.find(i => i.description === target)
                  targetAmount = parseFloat(targetItem.amount) * parseInt(targetItem.units)
                }
                capex_per_model_interval += targetAmount * item_amount
              }
            }
            if ((item.amount_growth.type === 'Fixed') && (month % amount_growth_interval === 0)) {
              item.amount = item_amount * (1 + parseFloat(item.amount_growth.initial) / 100)
            } else if ((item.amount_growth.type === 'Random Walk') && (month % amount_growth_interval === 0)) {
              item.amount = item_amount * (1 + parseFloat(item.amount_growth.initial) / 100)
              item.amount_growth.initial = parseFloat(item.amount_growth.initial) + student_t(
                parseFloat(item.amount_growth.mean),
                parseFloat(item.amount_growth.std),
                parseFloat(item.amount_growth.df)
              )
            } else if (item.amount_growth.type === 'Tabular') {
              // Tabular growth is aligned with the model interval (total number of steps)
              // Simulation loop goes over each month, so we need to increment the step
              item.amount = item.amount_growth.target_values[step + 1] || 0
            } else if ((item.amount_growth.type === 'Inflation') && (month % inflation_interval === 0)) {
              item.amount = item_amount * (1 + inflation / 100)
            }
          })


          // Update max values
          expenses_max = Math.max(expenses_max, expenses_per_model_interval, capex_per_model_interval)



          if (month % model_interval === 0) {
            // Calculate the net income
            step += 1
            effective_gross_income_per_model_interval = this.round(effective_gross_income_per_model_interval)
            expenses_per_model_interval = this.round(expenses_per_model_interval)
            potential_income_per_model_interval = this.round(potential_income_per_model_interval)
            let net_operating_income = effective_gross_income_per_model_interval - expenses_per_model_interval
            let taxes = (net_operating_income - debt_interest_paid - depreciation_per_model_interval) * (parseFloat(this.project.taxes.marginal_tax_rate) / 100)
            if (taxes < 0) taxes = 0

            let btcf =  this.round(net_operating_income - debt_service_paid)
            let atcf =  this.round(net_operating_income - debt_service_paid - taxes)
            let pbtcf = this.round(net_operating_income - debt_service_paid - capex_per_model_interval)
            let patcf = this.round(net_operating_income - debt_service_paid - capex_per_model_interval - taxes)

            btcfs.push(btcf)
            atcfs.push(atcf)
            pbtcfs.push(pbtcf)
            patcfs.push(patcf)

            discount_rates.push(discount_rate)

            results_data.push({ 
              sample,
              step,
              month, 
              economic_growth,
              inflation,
              discount_rate,
              debt_paid: debt_service_paid,
              debt_interest_paid,
              debt_principal_paid,
              debt_balance: debt_balance_prev,
              depreciation_per_model_interval,
              effective_gross_income_per_model_interval,
              potential_income_per_model_interval,
              expenses_per_model_interval: -expenses_per_model_interval,
              capex_per_model_interval: -capex_per_model_interval,
              net_operating_income,
              btcf,
              taxes,
              atcf,
              pbtcf,
              patcf
            })

            // Reset aggregated values
            debt_interest_paid = 0
            debt_principal_paid = 0
            debt_service_paid = 0

            potential_income_per_model_interval = 0
            effective_gross_income_per_model_interval = 0
            expenses_per_model_interval = 0
            capex_per_model_interval = 0
            depreciation_per_model_interval = 0
          }

          // Update the rates
          if ((month % economic_growth_interval === 0) && (this.project.model.economic_growth.active)) {
            if (this.project.model.economic_growth.type === 'Random Walk') {
              economic_growth += student_t(
                parseFloat(this.project.model.economic_growth.mean),
                parseFloat(this.project.model.economic_growth.std),
                parseFloat(this.project.model.economic_growth.df)
              )
            } else if (this.project.model.economic_growth.type === 'Tabular') {
              economic_growth = this.project.model.economic_growth.growth_values[step] || 0
            }
          }

          if ((month % inflation_interval === 0) && (this.project.model.inflation.active)) {
            if (this.project.model.inflation.type === 'Random Walk') {
              inflation += student_t(
                parseFloat(this.project.model.inflation.mean),
                parseFloat(this.project.model.inflation.std),
                parseFloat(this.project.model.inflation.df)
              )
            } else if (this.project.model.inflation.type === 'Tabular') {
              inflation = this.project.model.inflation.growth_values[step] || 0
            }
          }

          if ((month % discount_rate_interval === 0) && (this.project.model.discount_rate.active)) {
            if (this.project.model.discount_rate.type === 'Random Walk') {
              discount_rate += student_t(
                parseFloat(this.project.model.discount_rate.mean),
                parseFloat(this.project.model.discount_rate.std),
                parseFloat(this.project.model.discount_rate.df)
              )
            } else if (this.project.model.discount_rate.type === 'Tabular') {
              discount_rate = this.project.model.discount_rate.growth_values[step] || 0
            }
          }

        } // --> month loop

        // Buy/Selling
        const debt_balance_final = debt_balance_new
        const before_tax_equity_reversion = net_sale - debt_balance_final

        const depreciation_gain = depreciation_per_model_interval * model_steps
        const capital_gain = sale_price - purchase_price - purchase_costs - sale_costs

        const depreciation_tax = depreciation_gain * (parseFloat(this.project.taxes.recapture_tax_rate) / 100)
        const capital_gain_tax = capital_gain * (parseFloat(this.project.taxes.capital_gains_tax_rate) / 100)
        const total_tax = depreciation_tax + capital_gain_tax
        total_tax_samples.push(total_tax)

        const after_tax_equity_reversion = before_tax_equity_reversion - total_tax 

        // btcfs[-1] = btcfs[-1] + before_tax_equity_reversion
        btcfs = [-initial_equity, ...btcfs]
        btcfs[btcfs.length - 1] += before_tax_equity_reversion
        const btirr_per_model_interval = IRR(btcfs)
        const btirr_per_year = Math.pow(1 + btirr_per_model_interval, model_frequency) - 1 // annualize
        btirr_samples.push(btirr_per_year * 100)
        print('BTCF:', btcfs)
        print('BTIRR:', btirr_per_model_interval)
        print('BTIRR:', btirr_per_year)

        atcfs = [-initial_equity, ...atcfs]
        atcfs[atcfs.length - 1] += after_tax_equity_reversion
        const atirr_per_model_interval = IRR(atcfs)
        const atirr_per_year = Math.pow(1 + atirr_per_model_interval, model_frequency) - 1 // annualize
        atirr_samples.push(atirr_per_year * 100)
        print('ATCF:', atcfs)
        print('ATIRR:', atirr_per_model_interval)
        print('ATIRR:', atirr_per_year)

        pbtcfs = [-initial_equity, ...pbtcfs]
        pbtcfs[pbtcfs.length - 1] += before_tax_equity_reversion
        const pbtirr_per_model_interval = IRR(pbtcfs)
        const pbtirr_per_year = Math.pow(1 + pbtirr_per_model_interval, model_frequency) - 1 // annualize
        pbtirr_samples.push(pbtirr_per_year * 100)
        print('PBTCF:', pbtcfs)
        print('PBTIRR:', pbtirr_per_model_interval)
        print('PBTIRR:', pbtirr_per_year)


        patcfs = [-initial_equity, ...patcfs]
        patcfs[patcfs.length - 1] += after_tax_equity_reversion
        const patirr_per_model_interval = IRR(patcfs)
        const patirr_per_year = Math.pow(1 + patirr_per_model_interval, model_frequency) - 1 // annualize
        patirr_samples.push(patirr_per_year * 100)
        print('PATCF:', patcfs)
        print('PATIRR:', patirr_per_model_interval)
        print('PATIRR:', patirr_per_year)

        const npv = NPV(patcfs, discount_rates)
        print('NPV:', npv, patcfs, discount_rates)
        npv_samples.push(npv)
      } // --> sample loop

      console.log('Results data:', results_data)
      const results_data_aggregated = aggregate_samples(results_data)
      const results_data_first = results_data.filter(d => d.sample === 0)
      // Prepend the initial debt balance
      // results_data_first = [{ step: 0, month: 0, debt_balance: debt_amount }, ...results_data_first]

      this.has_results = true // This will trigger the results panel to show
      this.results.irr = mean(patirr_samples).toFixed(2)
      this.results.irr_std = std(patirr_samples).toFixed(2)
      this.results.npv = Number(mean(npv_samples)).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
      this.results.npv_std = Number(std(npv_samples)).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

      console.log('End run:', new Date())

      this.$nextTick(() => {
        console.log('Start visualization:', new Date())
        const description_property = describe_property(this.project, this.results)
        document.getElementById('description-property').innerHTML = description_property
        // const property_data = [
        //   { text: 'Debt', value: parseFloat(this.project.property.debt.amount) },
        //   { text: 'Purchase Price', value: purchase_price },
        //   { text: 'Sale Price', value: sale_price }
        // ]
        // property_data.forEach(d => {
        //   d.start = d.value > 0 ? d.value - purchase_price * 0.0075 : d.value
        //   d.end = d.value
        // })
        // const property_max = Math.max(purchase_price, debt_amount, sale_price)
        // const property_plot = Plot.plot({
        //   marginLeft: 100,
        //   x: {
        //     domain: [0, property_max],
        //     label: "Amount ($)"
        //   },
        //   y: {label: null},
        //   marks: [
        //     // Plot.barX(property_data, Plot.stackX({x: "value", fillOpacity: 0.3, inset: 0.5})),
        //     // Plot.textX(property_data, Plot.stackX({x: "value", text: "text", inset: 0.5})),
        //     Plot.barX(property_data, {y: "text", x: "value", inset: 0.5, fill: "#ddd", opacity: 0.5}),
        //     Plot.barX(property_data, {
        //       y: "text", 
        //       x1: "start",
        //       x2: "end",
        //       inset: 0.5, fill: "black", opacity: 1
        //     }),
        //     Plot.ruleX([0])
        //     // Plot.ruleX([0, 1])
        //   ]

        const property_data = []
        let p = 0
        let p_new = 0
        let i = 0
        p = -(purchase_price + purchase_costs)
        property_data.push({ i: i, text: 'Purchase', d: '▼', start: 0, end: p, value: p })
        p_new = p + debt_amount
        i += 1
        property_data.push({ i: i, text: 'Debt', start: p, d: '▲', end: p_new, value: debt_amount })
        p = p_new

        results_data_aggregated.forEach(d => {
          // Income
          i += 1
          let v = d.effective_gross_income_per_model_interval
          v = v / Math.pow(1 + d.discount_rate / 100, d.step)
          p_new = p + v
          property_data.push({
            i: i,
            text: `${this.project.model.interval} ${d.step}`, 
            d: '▲',
            dy: -2,
            start: p,
            end: p_new,
            value: d.effective_gross_income
          })
          p = p_new
          // Expenses
          i += 1
          v = d.expenses_per_model_interval + d.capex_per_model_interval - d.debt_paid - d.taxes
          v = v / Math.pow(1 + d.discount_rate / 100, d.step)
          // Apply the discount rate
          p_new = p + v
          property_data.push({
            i: i,
            text: `${this.project.model.interval} ${d.step}`, 
            d: '▼', 
            dy: 2,
            start: p,
            end: p_new,
            value: d.expenses 
          })
          p = p_new
          // Capex
          // i += 1
          // p_new = p + d.capex_per_model_interval
          // property_data.push({
          //   i: i,
          //   text: `${this.project.model.interval} ${d.step}`, 
          //   start: p,
          //   end: p_new,
          //   value: d.capex 
          // })
          // p = p_new
          // // Debt
          // // i += 1
          // p_new = p - d.debt_paid
          // property_data.push({
          //   i: i,
          //   text: `${this.project.model.interval} ${d.step}`, 
          //   start: p,
          //   end: p_new,
          //   value: d.debt_paid 
          // })
          // p = p_new
        })

        let discount_rate = results_data_aggregated[results_data_aggregated.length - 1].discount_rate

        i += 1
        let v = sale_price - sale_costs
        v = v / Math.pow(1 + discount_rate / 100, model_steps)
        p_new = p + v
        property_data.push({ i: i, text: 'Sale', d: '▲', dy: -1, start: p, end: p_new, value: sale_price })
        p = p_new

        i += 1
        v = results_data_aggregated[results_data_aggregated.length - 1].debt_balance
        v = v / Math.pow(1 + discount_rate / 100, model_steps)
        p_new = p - v
        property_data.push({ i: i, text: 'Debt', d: '▼', dy: 2, start: p, end: p_new, value: results_data_aggregated[results_data_aggregated.length - 1].debt_balance })
        p = p_new

        i += 1
        v = mean(total_tax_samples)
        v = v / Math.pow(1 + discount_rate / 100, model_steps)
        p_new = p - v
        property_data.push({ i: i, text: 'Tax', d: '▼', dy: 2, start: p, end: p_new, value: results_data_aggregated[results_data_aggregated.length - 1].debt_balance })
        p = p_new

        const property_plot = Plot.plot({
          width: 800,
          height: 400,
          marginLeft: 80,
          marginBottom: 100,
          x: {
            // domain: [0, property_max],
            label: null,
            tickFormat: d => property_data[d].text,
            tickRotate: -90
          },
          y: {
            label: null,
            grid: true,
            domain: [
              1.1 * Math.min(...property_data.map(x => Math.min(x.start, x.end))),
              1.1 * Math.max(...property_data.map(x => Math.max(x.start, x.end)))
            ]
          },
          marks: [
            Plot.barY(property_data, {x: "i", label: "text", y1: "start", y2: "end", sort: null, fill: "#ddd", opacity: 0.5}),
            Plot.tickY(property_data, {x: "i", label: "text", y: "end", sort: null, inset: 0.5}),
            Plot.ruleY([0], {stroke: "black", strokeWidth: 1, opacity: 0.3}),
            Plot.ruleY([mean(npv_samples)], {stroke: "black", strokeWidth: 1, opacity: 0.5, strokeDasharray: "2,2"}),
            Plot.text([[1, mean(npv_samples)]], {text: [`NPV: ${Number(mean(npv_samples)).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}`], textAnchor: "start", fontSize: 10, dx: 0, dy: 10}),
            Plot.text(property_data.filter(v => v.start > v.end), {x: "i", y: "end", text: "d", textAnchor: "middle", fontSize: 6, dy: -5}),
            Plot.text(property_data.filter(v => v.start < v.end), {x: "i", y: "end", text: "d", textAnchor: "middle", fontSize: 6, dy: 5}),
          ]
        })
        const property_results = document.getElementById('results-property')
        if (property_results) {
          property_results.innerHTML = ''
          property_results.appendChild(property_plot)
        }

        const opacity = parseInt(this.project.model.samples) > 1 ? 0.1 : 1;

        // Vis: Economic growth
        let growth_all_min = Math.min(
          0,
          Math.min(...results_data.map(x => x.economic_growth)),
          Math.min(...results_data.map(x => x.inflation)),
          Math.min(...results_data.map(x => x.discount_rate))
        )
        let growth_all_max = Math.max(
          0,
          Math.max(...results_data.map(x => x.economic_growth)),
          Math.max(...results_data.map(x => x.inflation)),
          Math.max(...results_data.map(x => x.discount_rate))
        )
        growth_all_max += (growth_all_max - growth_all_min) * 0.1
        growth_all_min -= (growth_all_max - growth_all_min) * 0.1

        const economic_growth_plot = Plot.plot({
          grid: true,
          width: 400,
          height: 200,
          x: { 
            label: this.project.model.interval,
            domain: [1, model_steps - 1]
          },
          y: { 
            label: "Economic Growth",
            domain: [growth_all_min, growth_all_max]
          },
          marks: [
            Plot.line(results_data.filter(x => x.step < model_steps), {
              x: "step",
              y: "economic_growth",
              z: "sample",
              opacity
            }),
            Plot.line(results_data_aggregated.filter(x => x.step < model_steps), {
              x: "step",
              y: "economic_growth",
              opacity: 1,
              stroke: "black",
              strokeDasharray: "4,4"
            }),
            Plot.crosshairX(results_data, {x: "step", y: "economic_growth"}),
            Plot.ruleY([0], {stroke: "black", strokeWidth: 1, opacity: 0.3}),
          ]
        })
        const economic_growth_results = document.getElementById('results-economic-growth')
        if (economic_growth_results) {
          economic_growth_results.innerHTML = ''
          economic_growth_results.appendChild(economic_growth_plot)
        }

        // Vis: Inflation
        const inflationPlot = Plot.plot({
          grid: true,
          width: 400,
          height: 200,
          x: { 
            label: this.project.model.interval,
            domain: [1, model_steps - 1]
          },
          y: { 
            label: "Inflation", 
            domain: [growth_all_min, growth_all_max]
          },
          marks: [
            Plot.line(results_data.filter(x => x.step < model_steps), { 
              x: "step",
              y: "inflation",
              z: "sample",
              opacity
            }),
            Plot.line(results_data_aggregated.filter(x => x.step < model_steps), {
              x: "step",
              y: "inflation",
              opacity: 1,
              stroke: "black",
              strokeDasharray: "4,4"
            }),
            Plot.crosshairX(results_data, {x: "step", y: "inflation"}),
            Plot.ruleY([0], {stroke: "black", strokeWidth: 1, opacity: 0.3}),
          ]
        })
        const inflationResults = document.getElementById('results-inflation')
        if (inflationResults) {
          inflationResults.innerHTML = ''
          inflationResults.appendChild(inflationPlot)
        }

        // Vis: Discount rate
        const discount_ratePlot = Plot.plot({
          grid: true,
          width: 400,
          height: 200,
          x: { label: this.project.model.interval },
          y: { 
            label: "Discount Rate",
            domain: [growth_all_min, growth_all_max]
          },
          marks: [
            Plot.line(results_data, {
              x: "step",
              y: "discount_rate",
              z: "sample",
              opacity
            }),
            Plot.line(results_data_aggregated, {
              x: "step",
              y: "discount_rate",
              opacity: 1,
              stroke: "black",
              strokeDasharray: "4,4"
            }),
            Plot.crosshairX(results_data, {x: "step", y: "discount_rate"}),
            Plot.ruleY([0], {stroke: "black", strokeWidth: 1, opacity: 0.3})
          ]
        })
        const discount_rate_results = document.getElementById('results-discount-rate')
        if (discount_rate_results) {
          discount_rate_results.innerHTML = ''
          discount_rate_results.appendChild(discount_ratePlot)
        }

        // Vis: Debt balance
        const debt_balance_plot = Plot.plot({
          grid: true,
          width: 500,
          height: 200,
          marginLeft: 80,
          x: { 
            label: this.project.model.interval,
            domain: [1, model_steps]
          },
          y: { 
            label: "Debt Balance",
            domain: [0, purchase_price + purchase_costs]
          },
          marks: [
            Plot.areaY(
              results_data_first,
              {x: "step", y: "debt_balance", fill: "#ddd", opacity: 0.5}
            ),
            Plot.line(results_data_first, {
              x: "step",
              y: "debt_balance",
              // z: "sample",
              opacity: 1
            }),
            Plot.text(
              [[1, Math.max(0.05 * purchase_price, 1.07 * debt_amount)]], 
              {
                text: [`Initial debt balance: ${(debt_amount).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}`], 
                textAnchor: "start", 
                dx: 16
              }
            ),
            Plot.text(
              [[1, 1.07 * purchase_price]], 
              {
                text: [`Purchase price: ${(purchase_price).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}`], 
                textAnchor: "start", 
                dx: 16
              }
            ),
            Plot.ruleY([debt_amount], {stroke: "black", strokeDasharray: "2,2", opacity: 0.5}),
            Plot.ruleY([purchase_price + purchase_costs], {stroke: "black", strokeDasharray: "2,2", opacity: 0.5}),
            Plot.ruleY([0], {stroke: "black", strokeWidth: 1, opacity: 0.3}),
          ]
        })
        const debt_balance_results = document.getElementById('results-debt-balance')
        const debt_balance_description = describe_debt_balance(this.project, results_data_aggregated)
        if (debt_balance_results) {
          debt_balance_results.innerHTML = ''
          debt_balance_results.appendChild(debt_balance_plot)
          debt_balance_results.innerHTML += debt_balance_description
        }

        // Now, create the stacked area chart:
        const debt_service_plot = Plot.plot({
          grid: true,
          width: 500,
          height: 200,
          marginLeft: 80,
          x: { 
            label: this.project.model.interval,
            domain: [1, model_steps]
          },
          y: { label: "Debt Service" },
          color: { 
            // manually set the color scale
            // scheme: 'greys',
            // legend: true,
            // legendPosition: 'bottom',
          },
          marks: [
            Plot.line(results_data_first, {
              x: "step",
              y: "net_operating_income",
              opacity: 1,
              strokeWidth: 1,
              stroke: "black",
              strokeDasharray: "2,2",
              opacity: 0.5,
              marker: true,
            }),
            Plot.line(results_data_first, {
              x: "step",
              y: "debt_paid",
              opacity: 1,
              stroke: "black",
              // strokeDasharray: "4,4"
            }),
            Plot.areaY(
              results_data_first,
              {x: "step", y: "debt_paid", fill: "#ddd", opacity: 0.5}
            ),
            Plot.line(results_data_first, {
              x: "step",
              y: "debt_interest_paid",
              opacity: 0.3,
              stroke: "black",
              // strokeDasharray: "2,2",
              strokeWidth: 1
            }),
            Plot.areaY(
              results_data_first,
              {x: "step", y: "debt_interest_paid", fill: "#ddd", opacity: 0.5}
            ),
            // Plot.areaY(
            //   results_data_first,
            //   {x: "step", y: "debt_interest_paid", fill: "#ccc", opacity: 0.5}
            // ),
            Plot.text(
              [[1, 1.1 * results_data_aggregated[0]['net_operating_income']]], 
              {
                text: ['NOI'],
                textAnchor: "start", 
                dx: 16
              }
            ),
            Plot.text(
              [[1, debt_service_per_model_interval + Math.max(0.05 * Math.max(...results_data_aggregated.map(x => x['net_operating_income'])), 0.07 * debt_service_per_model_interval)]], 
              {
                text: [`${this.project.model.interval}ly debt service: $${(debt_service_per_model_interval).toFixed(2)}`], 
                textAnchor: "start", 
                dx: 16
              }
            ),
            Plot.text(
              [[1, results_data_first[0]['debt_interest_paid'] + results_data_first[0]['debt_principal_paid'] / 2]], 
              {
                text: [debt_service_per_model_interval > 0 ? '· Principal' : ''],
                textAnchor: "start", 
                dx: 16
              }
            ),
            Plot.text(
              [[1, results_data_first[0]['debt_interest_paid'] / 2]], 
              {
                text: [debt_service_per_model_interval > 0 ? '· Interest' : ''],
                textAnchor: "start",
                dx: 16
              }
            ),
            Plot.crosshairX(results_data_first, {x: "step", y: "debt_interest_paid"}),
            Plot.ruleY([0], {stroke: "black", strokeWidth: 1, opacity: 0.3}),
          ],
        });
        const debt_service_results = document.getElementById('results-debt-service')
        const debt_service_description = describe_debt_service(results_data_aggregated)
        if (debt_service_results) {
          debt_service_results.innerHTML = ''
          debt_service_results.appendChild(debt_service_plot)
          debt_service_results.innerHTML += debt_service_description
        }

        const d = Math.max(effective_gross_income_max, expenses_max, debt_service_per_model_interval) * 1.1
        console.log('D:', d, effective_gross_income_max, expenses_max, debt_service_per_model_interval, results_data, results_data_aggregated)

        const iePlot = Plot.plot({
          grid: true,
          width: 1100,
          marginLeft: 80,
          height: 300,
          x: { 
            label: this.project.model.interval
          },
          y: { 
            label: "Income/Expenses",
            domain: [-d, d]
          },
          // legend
          marks: [
            // Plot.rectY(results_data_first, {x: "month", y: "btcf"}),
            // Plot.dot(results_data, {x: "month", y: "btcf", opacity: 0.1, r: 2}),
            // Plot.boxY(results_data, {x: "month", y: "effective_gross_income_per_model_interval", stroke: "green", title: "Effective Gross Income"}),
            Plot.boxY(results_data, {x: "step", y: "effective_gross_income_per_model_interval", title: "Effective Gross Income", r: 0}),
            Plot.boxY(results_data, {x: "step", y: "expenses_per_model_interval", title: "Effective Gross Income", r: 0}),
            Plot.line(
              results_data_aggregated, {
                x: "step",
                y: "net_operating_income",
                stroke: "black",
                strokeWidth:1,
                strokeDasharray: "2,2",
                marker: true,
                opacity: 0.5,
              }),
            // Plot.ruleY(results_data_first.map(x => ({step: x.step, debt_paid: -x.debt_paid})), {x: "step", y: "debt_paid", stroke: "black", strokeDasharray: "2,2", title: "Monthly Debt Service"}),
            // Plot.areaY(results_data_first.map(x => ({step: x.step, debt_paid: -x.debt_paid})), {x: "step", y: "debt_paid", fill: "#ddd", opacity: 0.5}),
            Plot.crosshairX(results_data, {x: "step", y: "effective_gross_income_per_model_interval"}),
            Plot.crosshairX(results_data, {x: "step", y: "expenses_per_model_interval"}),
            Plot.crosshairX(results_data_aggregated, {x: "step", y: "net_operating_income"}),
            Plot.text([[1, d * 0.8]], {text: ["▲ Income "], textAnchor: "start", dx: 0}),
            Plot.text([[1, -d * 0.8]], {text: ["▼ Expenses "], textAnchor: "start", dx: 0}),
            Plot.text([[1, 0.8 * results_data_aggregated[0]['net_operating_income']]], {text: ["NOI"], textAnchor: "start", dx: 0}),
            // Plot.boxY(results_data, {x: "month", y: "effective_gross_income_per_model_interval", color: "green", opacity: 0.5, title: "Effective Gross Income"}),
            // Plot.boxY(results_data, {x: "month", y: "expenses_per_model_interval", color: "red", opacity: 0.5, title: "Expenses"}),
            // add red scatter expenses
            Plot.ruleY([0], {opacity: 0.5}),
          ]
        })
        const ieResults = document.getElementById('results-ie')
        if (ieResults) {
          ieResults.innerHTML = ''
          ieResults.appendChild(iePlot)
        }


  
        // Circular incomes plot
        const circularIncomesPlot = Plot.plot({
          aspectRatio: 1,
          // inset: 10,
          width: 300,
          height: 300,
          grid: false,
          x: { 
            domain: [-d * 1.1, d * 1.1],
            label: 'Incomes',
            ticks: [0, Math.round(d / 1000) * 1000],
            // axis: null,
          },
          y: { 
            domain: [-d * 1.1, d * 1.1],
            axis: null,
          },
          marks: [
            Plot.line(
              results_data.map(d => ({
                x: Math.sin((d.month - 0) * 2 * Math.PI / 12) * d.effective_gross_income_per_model_interval,
                y: Math.cos((d.month - 0) * 2 * Math.PI / 12) * d.effective_gross_income_per_model_interval,
                z: d.sample,
                m: d.month,
                i: d.effective_gross_income_per_model_interval
              })),
              {x: 'x', y: 'y', z: 'z', marker: true, opacity: opacity == 1 ? 1 : opacity / 5}
            )
          ]
          .concat(Array(12).fill(0).map((v, i) => Plot.line([
            {
              x: 0,
              y: 0,
            },
            {
              x: Math.sin((i + 1) * 2 * Math.PI / 12) * d * 1.1,
              y: Math.cos((i + 1) * 2 * Math.PI / 12) * d * 1.1,
            },
          ], {x: 'x', y:'y', stroke: "black", opacity: 0.05})))
          .concat(Array(12).fill(0).map((v, i) => Plot.text([
            {
              x: Math.sin((i + 1) * 2 * Math.PI / 12) * d * 0.98,
              y: Math.cos((i + 1) * 2 * Math.PI / 12) * d * 0.98,
            },
          ], {x: 'x', y: 'y', text: [i == 11 ? 'Month: ' + (i + 1) : i + 1], textAnchor: "middle", dy: 0})))
        })
        const circularIncomesResults = document.getElementById('results-incomes-circular')
        if (circularIncomesResults) {
          circularIncomesResults.innerHTML = ''
          circularIncomesResults.appendChild(circularIncomesPlot)
        }

        const circularExpensesPlot = Plot.plot({
          aspectRatio: 1,
          // inset: 10,
          width: 300,
          height: 300,
          grid: false,
          x: { 
            domain: [-d * 1.1, d * 1.1],
            label: 'Expenses',
            ticks: [0, Math.round(d / 1000) * 1000],
            // axis: null,
          },
          y: { 
            domain: [-d * 1.1, d * 1.1],
            axis: null,
          },
          marks: [
            Plot.line(
              results_data.map(d => ({
                x: Math.sin((d.month - 0) * 2 * Math.PI / 12) * -d.expenses_per_model_interval,
                y: Math.cos((d.month - 0) * 2 * Math.PI / 12) * -d.expenses_per_model_interval,
                z: d.sample,
                m: d.month,
                i: d.expenses_per_model_interval
              })),
              {x: 'x', y: 'y', z: 'z', marker: true, opacity: opacity == 1 ? 1 : opacity / 5}
            )
          ]
          .concat(Array(12).fill(0).map((v, i) => Plot.line([
            {
              x: 0,
              y: 0,
            },
            {
              x: Math.sin((i + 1) * 2 * Math.PI / 12) * d * 1.1,
              y: Math.cos((i + 1) * 2 * Math.PI / 12) * d * 1.1,
            },
          ], {x: 'x', y:'y', stroke: "black", opacity: 0.05})))
          .concat(Array(12).fill(0).map((v, i) => Plot.text([
            {
              x: Math.sin((i + 1) * 2 * Math.PI / 12) * d * 0.98,
              y: Math.cos((i + 1) * 2 * Math.PI / 12) * d * 0.98,
            },
          ], {x: 'x', y: 'y', text: [i == 11 ? 'Month: ' + (i + 1) : i + 1], textAnchor: "middle", dy: 0})))
        })
        const circularExpensesResults = document.getElementById('results-expenses-circular')
        if (circularExpensesResults) {
          circularExpensesResults.innerHTML = ''
          circularExpensesResults.appendChild(circularExpensesPlot)
        }

        const circularDebtPlot = Plot.plot({
          aspectRatio: 1,
          // inset: 10,
          width: 300,
          height: 300,
          grid: false,
          x: { 
            label: 'Debt Service',
            domain: [-d * 1.1, d * 1.1],
            ticks: [0, Math.round(d / 1000) * 1000],
          },
          y: { 
            domain: [-d * 1.1, d * 1.1],
            axis: null,
          },
          marks: [
            Plot.line(
              results_data.map(d => ({
                x: Math.sin((d.month - 0) * 2 * Math.PI / 12) * d.debt_paid,
                y: Math.cos((d.month - 0) * 2 * Math.PI / 12) * d.debt_paid,
                z: d.sample,
                m: d.month,
                i: d.debt_paid
              })),
              {x: 'x', y: 'y', z: 'z', marker: true, opacity: opacity == 1 ? 1 : opacity / 5}
            )
          ]
          .concat(Array(12).fill(0).map((v, i) => Plot.line([
            {
              x: 0,
              y: 0,
            },
            {
              x: Math.sin((i + 1) * 2 * Math.PI / 12) * d * 1.1,
              y: Math.cos((i + 1) * 2 * Math.PI / 12) * d * 1.1,
            },
          ], {x: 'x', y:'y', stroke: "black", opacity: 0.05})))
          .concat(Array(12).fill(0).map((v, i) => Plot.text([
            {
              x: Math.sin((i + 1) * 2 * Math.PI / 12) * d * 0.98,
              y: Math.cos((i + 1) * 2 * Math.PI / 12) * d * 0.98,
            },
          ], {x: 'x', y: 'y', text: [i == 11 ? 'Month: ' + (i + 1) : i + 1], textAnchor: "middle", dy: 0})))
        })
        const circularDebtResults = document.getElementById('results-debt-circular')
        if (circularDebtResults) {
          circularDebtResults.innerHTML = ''
          circularDebtResults.appendChild(circularDebtPlot)
        }

        const btcfPlot = Plot.plot({
          grid: true,
          width: 1100,
          marginLeft: 80,
          height: 300,
          x: { label: this.project.model.interval },
          y: { label: "BTCF" },
          // color: { scheme: "RdYlGn" },
          marks: [
            // Plot.rectY(results_data_first, {x: "month", y: "btcf"}),
            // Plot.dot(results_data, {x: "month", y: "btcf", opacity: 0.1, r: 2}),
            Plot.boxY(results_data, {x: "step", y: "atcf", stroke: "black", title: "After Tax Cash Flow", opacity: 0.1, r: 0}),
            // Plot.boxY(results_data, {x: "month", y: "btcf", stroke: "btcf"}),
            Plot.boxY(results_data, {x: "step", y: "btcf", r: 0}),
            // Plot.dot(results_data, {x: "month", y: "effective_gross_income_per_model_interval", opacity, r: 0.5, stroke: "green", title: "Effective Gross Income"}),
            // Plot.dot(results_data, {x: "month", y: "expenses_per_model_interval", opacity, r: 0.5, stroke: "red", title: "Effective Gross Income"}),
            Plot.crosshairX(results_data, {x: "step", y: "btcf"}),
            // Plot.boxY(results_data, {x: "month", y: "effective_gross_income_per_model_interval", color: "green", opacity: 0.5, title: "Effective Gross Income"}),
            // Plot.boxY(results_data, {x: "month", y: "expenses_per_model_interval", color: "red", opacity: 0.5, title: "Expenses"}),
            // add red scatter expenses
            Plot.ruleY([0], {opacity: 0.5}),
          ]
        })
        const btcfResults = document.getElementById('results-btcf')
        if (btcfResults) {
          btcfResults.innerHTML = ''
          btcfResults.appendChild(btcfPlot)
        }

        const atcfPlot = Plot.plot({
          grid: true,
          width: 1100,
          marginLeft: 80,
          height: 300,
          x: { label: this.project.model.interval },
          y: { label: "ATCF" },
          // color: { scheme: "RdYlGn" },
          marks: [

            Plot.boxY(results_data, {x: "step", y: "btcf", stroke: "black", title: "Before Tax Cash Flow", opacity: 0.1, r: 0}),
            // Plot.boxY(results_data, {x: "month", y: "atcf", stroke: "atcf"}),
            Plot.boxY(results_data, {x: "step", y: "atcf", r: 0}),
            Plot.crosshairX(results_data, {x: "step", y: "atcf"}),
            Plot.ruleY([0], {opacity: 0.5}),
          ]
        })
        const atcfResults = document.getElementById('results-atcf')
        if (atcfResults) {
          atcfResults.innerHTML = ''
          atcfResults.appendChild(atcfPlot)
        }

        // Plot.rectY({length: 10000}, Plot.binX({y: "count"}, {x: d3.randomNormal()})).plot()

        let minIrr = Math.min(...pbtirr_samples, ...patirr_samples)
        let maxIrr = Math.max(...pbtirr_samples, ...patirr_samples)

        const btirrPlot = Plot.plot({
          width: 500,
          height: 200,
          x: { label: "BTIRR, %", domain: [minIrr*0.9, maxIrr*1.1] },
          y: { label: "_", grid: true, axis: false },
          marks: [
            // Plot.rectY(
            //   pbtirr_samples.map((d, i) => ({sample: i, irr: d})), 
            //   Plot.binX({y: "count"}, {x: 'irr', thresholds: 30, opacity: 0.3})
            // ),
            Plot.areaY(
              pbtirr_samples.map((d, i) => ({sample: i, irr: d})),
              Plot.binX(
                { y: "count", filter: null }, // using y2 to avoid areaY’s implicit stacking
                {
                  x: 'irr',
                  fill: "#ccc",
                  fillOpacity: 0.3,
                  thresholds: 10,
                  curve: "natural"
                }
              )
            ),
            Plot.lineY(
              pbtirr_samples.map((d, i) => ({sample: i, irr: d})),
              Plot.binX(
                { y: "count", filter: null },
                {
                  x: 'irr',
                  stroke: "black",
                  opacity: 0.3,
                  strokeWidth: 1,
                  thresholds: 10,
                  curve: "natural"
                }
              )
            ),
            Plot.ruleX([mean(pbtirr_samples)], {stroke: "black", strokeDasharray: "2,2"}),
            Plot.ruleY([0], {opacity: 0.5}),
          ]
        })
        const btirrResults = document.getElementById('results-btirr')
        if (btirrResults) {
          btirrResults.innerHTML = ''
          btirrResults.appendChild(btirrPlot)
          btirrResults.innerHTML += `<h2 style="position: absolute; top: 0; left: 10px; font-size: 36px;">${mean(pbtirr_samples).toFixed(2)}%</h2>`
        }

        const atirrPlot = Plot.plot({
          width: 500,
          height: 200,
          x: { label: "ATIRR, %", domain: [minIrr*0.9, maxIrr*1.1] },
          y: { label: "_", grid: true, axis: false },
          marks: [
            // Plot.rectY(
            //   patirr_samples.map((d, i) => ({sample: i, irr: d})), 
            //   Plot.binX({y: "count"}, {x: 'irr', thresholds: 30, opacity: 0.3})
            // ),
            Plot.areaY(
              patirr_samples.map((d, i) => ({sample: i, irr: d})),
              Plot.binX(
                { y: "count", filter: null }, // using y2 to avoid areaY’s implicit stacking
                {
                  x: 'irr',
                  fill: "#ccc",
                  fillOpacity: 0.3,
                  thresholds: 10,
                  curve: "natural"
                }
              )
            ),
            Plot.lineY(
              patirr_samples.map((d, i) => ({sample: i, irr: d})),
              Plot.binX(
                { y: "count", filter: null },
                {
                  x: 'irr',
                  stroke: "black",
                  opacity: 0.3,
                  strokeWidth: 1,
                  thresholds: 10,
                  curve: "natural"
                }
              )
            ),
            Plot.ruleX([mean(patirr_samples)], {stroke: "black", strokeDasharray: "2,2"}),
            Plot.ruleY([0], {opacity: 0.5}),
            // Plot.text([1, 1], {text: "Mean: " + mean(atirr_samples).toFixed(2) + "%", textAnchor: "start", dx: 10})
            // Plot.text(['Mean'], {x: Math.min(...atirr_samples) - 1, y: 1, textAnchor: "start", dx: 10})
          ]
        })
        const atirrResults = document.getElementById('results-atirr')
        if (atirrResults) {
          atirrResults.innerHTML = ''
          atirrResults.appendChild(atirrPlot)
          atirrResults.innerHTML += `<h2 style="position: absolute; top: 0; left: 10px; font-size: 36px;">${mean(patirr_samples).toFixed(2)}%</h2>`
        }


        const format = {}
        Object.keys(results_data_aggregated[0]).forEach(k => {
          // console.log('Data aggregated:', k)
          if (k == 'month') {
            format[k] = (d, i) => d % 12 === 0 
              ? html`<div style="
                color: black; 
                font-size: 12px; 
                float: right; 
                box-sizing: border-box; 
                overflow: visible; 
                display: flex; 
                justify-content: end;
                ">Year ${d / 12}</div>` 
              : html`<div style="
                color: grey; 
                font-size: 10px;  
                float: right; 
                box-sizing: border-box; 
                overflow: visible; 
                display: flex; 
                justify-content: end;
                ">${d}</div>`
          }
          else if (k.includes('std')) {
            format[k] = (d, i) => html`<div style="
              color: grey;
              font-size: 10px;
              float: left;
              box-sizing: border-box;
              overflow: visible;
              display: flex;
              justify-content: end;
              font-family: monospace;
            ">±${d.toFixed(2)}</div>`
          } else {
            format[k] = (d, i) => html`<div style="
              color: black;
              font-size: 12px;
              float: right;
              box-sizing: border-box;
              overflow: visible;
              display: flex;
              justify-content: end;
              font-family: monospace;
            ">${Number(d).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>`
          }
        })  
        // ;['economic_growth', 'inflation', 'discount_rate', 'debt_paid', 'debt_interest_paid', 'debt_principal_paid', 'debt_balance', 'effective_gross_income_per_model_interval', 'potential_income_per_model_interval', 'expenses_per_model_interval', 'net_operating_income', 'btcf', 'taxes', 'atcf'].forEach(key => {
        //   format[key] = (d, i) => results_data_aggregated[i][key + '_std'] > 0.005
        //       ? html`${d.toFixed(2)}<span style="color:red; width: 50px; display: inline-block"> ± ${results_data_aggregated[i][key + '_std'].toFixed(2)} </span>`
        //       : d.toFixed(2)
        // })

        console.log(format)

        const columns = [
          'month',
          'debt_interest_paid',
          'debt_principal_paid',
          'debt_balance',
          'potential_income_per_model_interval',
          'potential_income_per_model_interval_std',
          'effective_gross_income_per_model_interval',
          'effective_gross_income_per_model_interval_std',
          'expenses_per_model_interval',
          'expenses_per_model_interval_std',
          'net_operating_income',
          'net_operating_income_std',
          'btcf',
          'btcf_std',
          'pbtcf',
          'pbtcf_std',
          'taxes',
          'taxes_std',
          'atcf',
          'atcf_std',
          'patcf',
          'patcf_std',
        ]

        // iterate over columns and check _std values in results_data_aggregated and if all 0 remove column
        const header = {
            month: 'Month',
            debt_interest_paid: 'Interest Paid',
            debt_principal_paid: 'Principal Paid',
            debt_balance: 'Debt Balance',
            potential_income_per_model_interval: 'PGI',
            effective_gross_income_per_model_interval: 'EGI',
            expenses_per_model_interval: 'Expenses',
            net_operating_income: 'NOI',
            btcf: 'BTCF',
            taxes: 'Income Taxes',
            atcf: 'ATCF',
            pbtcf: 'PBTCF',
            patcf: 'PATCF',
          } 

        const columns_new = []
        columns.forEach(col => {
          if (col.includes('_std') || col.includes('paid') || ['taxes', 'debt_balance'].includes(col)) {
            const values = results_data_aggregated.map(d => d[col])
            if (!values.every(v => v < 0.005)) {
              columns_new.push(col)
              if (col.includes('_std')) {
                header[col] = html`<div style="color: grey; font-weight: 300; float: left; box-sizing: border-box; overflow: visible; display: flex; justify-content: end;">Std</div>`
              }
            }
          } else {
            columns_new.push(col)
          }
        })


        const table = Inputs.table(results_data_aggregated, {
          rows: 1000,
          select: false,
          // layout: 'fixed',
          columns: columns_new,
          header: header,
          format: format
          // {
          //   debt_paid: (d, i) => '$' + d.toFixed(2) + ' ± ' + results_data_aggregated[i]['debt_paid_std'].toFixed(2),
          //   debt_interest_paid: (d, i) => '$' + d.toFixed(2) + ' ± ' + results_data_aggregated[i]['debt_interest_paid_std'].toFixed(2),
          //   debt_principal_paid: (d, i) => '$' + d.toFixed(2) + ' ± ' + results_data_aggregated[i]['debt_principal_paid_std'].toFixed(2),
          //   debt_balance: (d, i) => '$' + d.toFixed(2) + ' ± ' + results_data_aggregated[i]['debt_balance_std'].toFixed(2),
          //   effective_gross_income_per_model_interval: (d, i) => '$' + d.toFixed(2) + ' ± ' + results_data_aggregated[i]['effective_gross_income_per_model_interval_std'].toFixed(2),
          //   expenses_per_model_interval: (d, i) => '$' + d.toFixed(2) + ' ± ' + results_data_aggregated[i]['expenses_per_model_interval_std'].toFixed(2),
          // }
        });

        console.log('Table:', results_data)

        // Display the slider on the page.

        // Insert the plot into the div with id="results"
        const resultsDiv = document.getElementById("results");
        if (resultsDiv) {
          resultsDiv.innerHTML = ""; // Clear any previous content
          resultsDiv.appendChild(table)
        } else {
          console.error('Element with id "results" not found.');
        }

        console.log('End vis:', new Date())


      // el.style.display = 'block'
        if (!autorun) {
          const el = document.getElementById('results-container')
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
          this.shuffle_logo()
        }
      })
    },

    copyLinkToClipboard() {
      // Compress project data to URL
      console.log('Project:', JSON.stringify(this.project, null, 2))
      const compressed_data = this.compressData(this.project);

      // Create URL with compressed data as parameter
      const url = new URL(window.location.href);
      url.searchParams.set('data', compressed_data);

      // Copy to clipboard
      navigator.clipboard.writeText(url.toString())
        .then(() => {
          // Show success notification (you might want to add a toast/snackbar component)
          // alert('Link copied to clipboard!');
          this.showAlert = true
        })
        .catch(err => {
          console.error('Failed to copy link: ', err);
          // alert('Failed to copy link');
        });
    },

    // Load data from URL if present
    load_project() {
      const url_params = new URLSearchParams(window.location.search)
      const compressed_data = url_params.get('data')
      if (compressed_data) {
        try {
          const decoded_project = this.decompress_data(compressed_data)
          this.project = this.merge_with_defaults(decoded_project)
          // Clear URL after loading
          const url = new URL(window.location.href)
          url.searchParams.delete('data')
          window.history.replaceState({}, document.title, url.toString())
          // Close all active panels
          this.active_panels = []
          this.run()
        } catch (error) {
          console.error('Failed to load project data from URL:', error);
          alert('Invalid project data in URL');
        }
      } else {
        // Load default
        this.active_panels = []
        this.project = JSON.parse(JSON.stringify(projects.default_project))
        // this.project = JSON.parse(JSON.stringify(projects.default_project))
      }
    },

    // Compress project data to a URL-friendly string
    compressData(projectData) {
      // Step 1: Define a mapping schema from long property names to short codes
      const schema = {
        // Model
        'model': 'm',
        'samples': 's',
        'economic_growth': 'eg',
        'inflation': 'if',
        'discount_rate': 'dr',
        'initial': 'i',
        'mean': 'mn',
        'std': 'sd',
        'df': 'd',
        'interval': 'iv',
        
        // Property
        'property': 'p',
        'name': 'n',
        'debt': 'dt',
        'amount': 'a',
        'term': 't',
        'rate': 'r',
        'purchase': 'pc',
        'price': 'pr',
        'costs': 'c',
        'sale': 'sl',
        
        // Taxes
        'taxes': 'tx',
        'depreciation': 'dp',
        'period': 'pd',
        'marginal_tax_rate': 'mtr',
        'capital_gains_tax_rate': 'cgr',
        'recapture_tax_rate': 'rtr',
        
        // Income & Expenses
        'income': 'inc',
        'expenses': 'exp',
        'items': 'it',
        'id': 'id',
        'description': 'ds',
        'active': 'ac',
        'min': 'mi',
        'max': 'mx',
        'type': 'ty',
        'amount_growth': 'ag',
        'target_values': 'av',
        'growth_values': 'gv',
        'units': 'un',
        'occupancy': 'oc',
        'occupancy_growth': 'og',
        'frequency': 'fr',
        'target': 'tg',
        'update': 'up',
        'factor': 'fc'
      };

      // Step 2: Convert the project using schema
      const compressed = this.convertUsingSchema(projectData, schema);

      // Step 3: Stringify and compress
      const jsonString = JSON.stringify(compressed);
      return LZString.compressToEncodedURIComponent(jsonString);
    },

    // Convert object keys using schema
    convertUsingSchema(obj, schema) {
      if (obj === null || typeof obj !== 'object') {
        return obj;
      }
      
      if (Array.isArray(obj)) {
        return obj.map(item => this.convertUsingSchema(item, schema));
      }
      
      const result = {};
      for (const [key, value] of Object.entries(obj)) {
        const shortKey = schema[key] || key;
        result[shortKey] = this.convertUsingSchema(value, schema);
      }
      
      return result;
    },
    
    // Decompress URL data to project object
    decompress_data(compressed_data) {
      // Step 1: Define reverse mapping schema
      const reverseSchema = {
        // Model
        'm': 'model',
        's': 'samples',
        'eg': 'economic_growth',
        'if': 'inflation',
        'dr': 'discount_rate',
        'i': 'initial',
        'mn': 'mean',
        'sd': 'std',
        'd': 'df',
        'iv': 'interval',
        
        // Property
        'p': 'property',
        'n': 'name',
        'dt': 'debt',
        'a': 'amount',
        't': 'term',
        'r': 'rate',
        'pc': 'purchase',
        'pr': 'price',
        'c': 'costs',
        'sl': 'sale',
        
        // Taxes
        'tx': 'taxes',
        'dp': 'depreciation',
        'pd': 'period',
        'mtr': 'marginal_tax_rate',
        'cgr': 'capital_gains_tax_rate',
        'rtr': 'recapture_tax_rate',
        
        // Income & Expenses
        'inc': 'income',
        'exp': 'expenses',
        'it': 'items',
        'id': 'id',
        'ds': 'description',
        'ac': 'active',
        'mi': 'min',
        'mx': 'max',
        'ty': 'type',
        'ag': 'amount_growth',
        'av': 'target_values',
        'gv': 'growth_values',
        'un': 'units',
        'oc': 'occupancy',
        'og': 'occupancy_growth',
        'fr': 'frequency',
        'tg': 'target',
        'up': 'update',
        'fc': 'factor'
      };
      
      // Step 2: Decompress and parse JSON
      const jsonString = LZString.decompressFromEncodedURIComponent(compressed_data);
      const compressed = JSON.parse(jsonString);
      
      // Step 3: Convert back using reverse schema
      return this.convertUsingSchema(compressed, reverseSchema);
    },

    // Deep merge objects to ensure defaults are maintained
    merge_with_defaults(project_loaded) {
      // Create a deep merged object from default project and loaded data
      const project_default = JSON.parse(JSON.stringify(projects.default_project))
      const project_merged = this.deep_merge(project_default, project_loaded)
      // Iterate over each item in the income and expenses lists and merge with default_income and default_expense
      project_merged.income.items = project_merged.income.items
        .map(item => this.deep_merge(
          JSON.parse(JSON.stringify(projects.default_income)),
          item
        ))
      project_merged.expenses.items = project_merged.expenses.items
        .map(item => this.deep_merge(
          JSON.parse(JSON.stringify(projects.default_expense)),
          item
        ))
      return project_merged
    },

    // Helper function for deep merging objects
    deep_merge(target, source) {
      if (!source) return target;

      const output = {...target};

      if (this.isObject(target) && this.isObject(source)) {
        Object.keys(source).forEach(key => {
          if (this.isObject(source[key])) {
            if (!(key in target)) {
              Object.assign(output, { [key]: source[key] });
            } else {
              output[key] = this.deep_merge(target[key], source[key]);
            }
          } else {
            Object.assign(output, { [key]: source[key] });
          }
        });
      }
      
      return output;
    },
    
    // Helper to check if value is an object
    isObject(item) {
      return (item && typeof item === 'object' && !Array.isArray(item));
    },

    removeRow(listName, id) {
      // Remove the item with the matching id from the specified list (income or expenses)
      this.project[listName].items = this.project[listName].items.filter(item => item.id !== id)
    },

    cloneRow(listName, id) {
      // Find the item to clone in the specified list
      const original = this.project[listName].items.find(item => item.id === id)
      if (original) {
        // Create a deep copy of the original item
        const clonedItem = JSON.parse(JSON.stringify(original))
        const currentIds = this.project[listName].items.map(i => i.id)
        const newId = Math.max(...currentIds) + 1
        clonedItem.id = newId
        this.project[listName].items.push(clonedItem)
      }
    },

    on_change_inflation() {
      this.project.model.inflation.active = true
      this.project.model.inflation.type = 'Fixed'
      this.run()
    },

    on_change_discount_rate() {
      this.project.model.discount_rate.active = true
      this.project.model.discount_rate.type = 'Fixed'
      this.run()
    },

    on_change_economic_growth() {
      this.project.model.economic_growth.active = true
      this.project.model.economic_growth.type = 'Fixed'
      this.run()
    },
  }, // *run()
  beforeMount() {
    this.load_project()
  },
  mounted() {
    this.shuffle_logo()
    //disable loader
    // const loader = document.getElementById('loader')
    // if (loader) {
    //   loader.style.display = 'none'
    // }
  },
  watch: {
    project: {
      deep: true,
      handler() {
        if (this.project.autorun) {
          this.run(true)
        }
        this.project_code = JSON.stringify(this.project, null, 2)
      }
    },
    // project_code is string. when changed - parse and update the project
    project_code: {
      handler(new_code) {
        try {
          this.project = JSON.parse(new_code)
        } catch (error) {
          console.error('Failed to parse project code:', error)
        }
      }
    }
  }
}
</script>
