package builder

import (
	"fmt"
	"github.com/ZupIT/charlescd/compass/sidecar/configuration"
	"io/ioutil"
	"log"
	"os/exec"
)

func buildPlugins(plugins map[string][]string) error {
	buildScriptName := "build.sh"

	for category, plugins := range plugins {
		for _, plugin := range plugins {
			out, err := exec.Command("/bin/sh", fmt.Sprintf("%s/%s", configuration.GetEnv("SCRIPTS_DIR"), buildScriptName), category, plugin).Output()
			if err != nil {
				fmt.Println(err)
				return err
			}

			fmt.Println(string(out))
		}
	}

	return nil
}

func ManagePlugins() error {
	pluginMap := make(map[string][]string)
	folders, err := ioutil.ReadDir(configuration.GetEnv("PLUGINS_DIR"))
	if err != nil {
		log.Fatal(err)
	}

	for _, category := range folders {
		if category.IsDir() {

			plugins, err := ioutil.ReadDir(configuration.GetEnv("PLUGINS_DIR") + "/" + category.Name())
			if err != nil {
				log.Fatal(err)
			}

			for _, plugin := range plugins {
				pluginMap[category.Name()] = append(pluginMap[category.Name()], plugin.Name())
			}
		}
	}

	err = buildPlugins(pluginMap)
	if err != nil {
		return err
	}

	return nil
}

//
//func removePlugins(plugins map[string][]string) error {
//	name := "/bin/sh"
//	removeScriptName := "remove.sh"
//
//	for category, plugins := range plugins {
//		for _, plugin := range plugins {
//			out, err := exec.Command(name, fmt.Sprintf("%s/%s", configuration.GetEnv("SCRIPTS_DIR"), removeScriptName), category, plugin).Output()
//			if err != nil {
//				fmt.Println(err)
//				return err
//			}
//
//			fmt.Println(string(out))
//		}
//	}
//
//	return nil
//}
